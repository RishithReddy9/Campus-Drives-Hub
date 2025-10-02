// app/api/auth/send-otp/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { email } = await req.json();
  await dbConnect();

  // check whitelist
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "Email not authorized" }, { status: 401 });
  }

  // generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry
  await user.save();

  // send email
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASS,
    },
  });

  await transport.sendMail({
    to: email,
    from: process.env.EMAIL_FROM,
    subject: "Your Login OTP",
    text: `Your OTP is ${otp}`,
    html: `<p>Your OTP is <b>${otp}</b>. It will expire in 5 minutes.</p>`,
  });

  return NextResponse.json({ success: true });
}

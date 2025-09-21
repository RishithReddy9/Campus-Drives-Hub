import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Resource from "@/models/Resource";

// GET all resources
export async function GET() {
  await dbConnect();
  const resources = await Resource.find({});
  return NextResponse.json(resources);
}

// POST new resource
export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const resource = await Resource.create(body);
  return NextResponse.json(resource, { status: 201 });
}

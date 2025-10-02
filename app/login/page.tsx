"use client";

import { useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { set } from "mongoose";

export default function LoginPage() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    setError("");
    setMessage("");

    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("OTP sent! Check your email.");
      setStep("otp");
    } else {
      setError(data.error || "Failed to send OTP");
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      email,
      otp,
      redirect: false,
    });
    if (res?.error){
      setError("Invalid OTP");
      return;
    }

    router.replace("/");
  }

  return (
    <section className="max-w-md mx-auto mt-12 bg-white p-6 shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      {step === "email" && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {loading? (<button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Sending...
          </button>): (<button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Send OTP
          </button>)}
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full border p-2 rounded"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          {
          !loading ? 
            (<button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
              Verify OTP
            </button>) : 
            (<button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
              Verifying...
            </button>)
          }
        </form>
      )}

      {message && <p className="text-green-600 mt-2">{message}</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </section>
  );
}

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@heroui/input";
import { InputOtp } from "@heroui/input-otp";
import { Button } from "@heroui/button";
import { Mail, KeyRound } from "lucide-react";

export default function LoginPage() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("✅ OTP sent! Check your email.");
      setStep("otp");
    } else {
      setError(data.error || "❌ Failed to send OTP");
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      otp,
      redirect: false,
    });

    if (res?.error) {
      setError("❌ Invalid OTP");
      setLoading(false);
      return;
    }

    router.replace("/");
  };

  return (
    <section className="max-w-md mx-auto mt-16 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-8 shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
        Welcome Back 👋
      </h1>
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
        Sign in with your email & OTP to access placement resources.
      </p>

      {step === "email" && (
        <form onSubmit={handleSendOtp} className="space-y-6">
          <Input
            type="email"
            label="Email Address"
            placeholder="example@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="bordered"
            startContent={<Mail className="w-4 h-4 text-gray-400" />}
            required
          />
          <Button
            type="submit"
            color="primary"
            variant="shadow"
            isLoading={loading}
            className="w-full"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </Button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <KeyRound className="w-4 h-4" /> Enter OTP
            </label>
            <InputOtp
              length={6}
              value={otp}
              onValueChange={setOtp}
              variant="bordered"
              className="justify-center"
            />
          </div>

          <Button
            type="submit"
            color="success"
            variant="shadow"
            isLoading={loading}
            className="w-full"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>
      )}

      {/* Messages */}
      {message && (
        <p className="text-green-600 dark:text-green-400 mt-4 text-center">
          {message}
        </p>
      )}
      {error && (
        <p className="text-red-500 dark:text-red-400 mt-4 text-center">
          {error}
        </p>
      )}

      {/* Membership Section */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Not a member yet?
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Become a member today to unlock exclusive preparation resources and
          interview experiences.
        </p>
        <a href="https://forms.gle/i1KoR178PVmUgph28" target="_blank" rel="noopener noreferrer">
          <Button
            color="secondary"
            variant="flat"
            className="w-full sm:w-auto"
          >
            Become a Member
          </Button>
        </a>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          Already a member? Please contact{" "}
          <a
            href="mailto:iste@vnrvjiet.in"
            className="text-blue-600 dark:text-blue-400 underline"
          >
            iste@vnrvjiet.in
          </a>{" "}
          for support.
        </p>
      </div>
    </section>
  );
}

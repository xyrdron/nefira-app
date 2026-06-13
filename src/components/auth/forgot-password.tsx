"use client";

import { Input, Button, Spinner } from "@heroui/react";
import { Key } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import TurnstileModal from "@/components/turnstileModal";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnstileCallback] = useState<(token: string) => void>(() => {});
  const [modalOpen] = useState(false);

  const handleReset = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
  };

  return (
    <form className="space-y-4" onSubmit={handleReset}>
      <div className="space-y-2 text-center">
        <h1 className="text-xl font-semibold">Reset password</h1>
        <p className="text-sm text-default-500">
          Enter your email address and we will send you a link to reset your
          password.
        </p>
      </div>

      <div className="space-y-3">
        <Input
          //isRequired
          //label="Email"
          placeholder="gamer@nefira.xyz"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TurnstileModal
          open={modalOpen}
          onToken={(t) => {
            turnstileCallback(t); // call the current callback
          }}
        />

        <Button
          fullWidth
          //color="primary"
          isDisabled={loading}
          //startContent={!loading ? <Key size={16} /> : undefined}
          type="submit"
        >
          {loading ? <Spinner size="sm" /> : "Send Reset Link"}
        </Button>
        <p className="text-center text-xs text-default-400">
          Already chat with us?{" "}
          <Link className="text-primary hover:underline" href="/login">
            Sign In
          </Link>
        </p>
      </div>
    </form>
  );
}

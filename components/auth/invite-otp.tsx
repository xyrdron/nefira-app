"use client";
import { Alert, InputOtp, Button, Spinner } from "@heroui/react";
import { Key } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function InviteOtp() {
  const [otpvalue, setOtp] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  if (process.env.NEXT_PUBLIC_INVITE_ENABLED === "false") {
    return (
      <div>
        <Alert
          color="danger"
          description="Account creation via an admin issued code is currently disabled. Please contact us if you believe this is an error."
          title="Invite codes are currently disabled"
          variant="faded"
        />
        <p className="pt-3 text-center text-xs text-default-400">
          Already chat with us?{" "}
          <Link className="text-primary hover:underline" href="/app/login">
            Sign In
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
        if (otpvalue.length === 6) {
          setLoading(true);
          setDisabled(true);
        }
      }}
    >
      <div className="space-y-2 text-center">
        <h1 className="text-xl font-semibold">Sign up with invite code</h1>
        <p className="text-sm text-default-500">
          Use the invite code provided to you by an administrator to create your
          account.
        </p>
      </div>

      <div className="m-auto flex space-y-3 justify-center pb-4">
        <InputOtp
          isRequired
          aria-label="OTP input field"
          errorMessage="Invalid invite code"
          isDisabled={disabled}
          isInvalid={submitted && otpvalue.length < 6}
          length={6}
          size="lg"
          value={otpvalue}
          variant="faded"
          onValueChange={setOtp}
        />
      </div>
      <Button
        fullWidth
        color="primary"
        isDisabled={loading}
        startContent={!loading ? <Key size={16} /> : undefined}
        type="submit"
      >
        {loading ? <Spinner color="white" size="sm" /> : "Validate"}
      </Button>
      <p className="text-center text-xs text-default-400">
        Already chat with us?{" "}
        <Link className="text-primary hover:underline" href="/login">
          Sign In
        </Link>
      </p>
    </form>
  );
}

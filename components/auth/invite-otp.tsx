"use client";
import { Alert, InputOTP, Button, Spinner } from "@heroui/react";
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
          //description="Account creation via an admin issued code is currently disabled. Please contact us if you believe this is an error."
          title="Invite codes are currently disabled"
          //variant="faded"
        ><p>Invite codes are currently disabled</p></Alert>
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
    <p>Disabled</p>
  );
}

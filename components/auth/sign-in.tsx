"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { 
  Button, 
  Input, 
  Checkbox, 
  Spinner, 
  Alert, 
  TextField, 
  Label 
} from "@heroui/react";
import { Key } from "lucide-react";
import Link from "next/link";

import { signIn } from "@/lib/auth-client";
import TurnstileModal from "@/components/turnstileModal";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertVariant, setAlertVariant] = useState<
    "success" | "danger" | "warning"
  >("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");

  const router = useRouter();

  const [turnstileCallback, setTurnstileCallback] = useState<
    (token: string) => void
  >(() => {});
  const [modalOpen, setModalOpen] = useState(false);

  function showAlert(
    title: string,
    message: string,
    variant: "success" | "danger" | "warning",
    visibility: boolean = true,
  ) {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVariant(variant);
    setAlertVisible(visibility);
  }

  function waitForTurnstile() {
    return new Promise<string>((resolve) => {
      setModalOpen(true); 
      const handler = (token: string) => {
        setModalOpen(false); 
        resolve(token); 
      };

      setTurnstileCallback(() => handler);
    });
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    showAlert("", "", alertVariant, false);
    
    try {
      const token = await waitForTurnstile();
      const { data, error } = await signIn.email(
        {
          email,
          password,
          rememberMe: rememberMe ? true : false,
          fetchOptions: {
            headers: {
              "x-captcha-response": token,
            },
          },
        },
        {
          onRequest: () => setLoading(true),
          onResponse: () => setLoading(false),
        },
      );

      if (error) {
        if (error == undefined) {
          throw new Error("An unknown error occurred");
        }
        showAlert(
          "Sign-in failed",
          error.message || "Unknown error",
          "warning",
        );

        return;
      }

      if (data?.user) {
        showAlert(
          "Welcome back, " + data.user.name,
          "You have successfully signed in.",
          "success",
        );
        router.push("/app/home");
      } else {
        showAlert(
          "There is a problem with your account",
          "Please contact support for information",
          "danger",
        );
      }
    } catch {
      showAlert(
        "An unexpected error occurred",
        "If the error persists please contact support",
        "danger",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSignIn}>
      {/* 1. Alert is now a Compound Component */}
      {alertVisible && (
        <Alert status={alertVariant}>
          <Alert.Indicator />
          <Alert.Content>
            {alertTitle && <Alert.Title>{alertTitle}</Alert.Title>}
            {alertMessage && <Alert.Description>{alertMessage}</Alert.Description>}
          </Alert.Content>
        </Alert>
      )}

      <div className="space-y-2 text-center">
        <h1 className="text-xl font-semibold">Welcome back!</h1>
        <p className="text-sm text-default-500">
          Sign into your account to begin chatting!
        </p>
      </div>

      <div className="space-y-3">
        {/* 2. Inputs use the new TextField wrapper */}
        <TextField
          isRequired
          type="email"
          value={email}
          onChange={setEmail} 
        >
          <Label>Email</Label>
          <Input placeholder="gamer@nefira.xyz" />
        </TextField>

        <TextField
          isRequired
          type="password"
          value={password}
          onChange={setPassword}
        >
          <Label>Password</Label>
          <Input placeholder="••••••••" />
        </TextField>

        <div className="flex items-center gap-2">
          {/* 3. Checkbox requires a Label child and uses onChange */}
          <Checkbox
            isSelected={rememberMe}
            onChange={setRememberMe}
          >
            <Label className="text-sm">Remember me</Label>
          </Checkbox>
        </div>
        
        <TurnstileModal
          open={modalOpen}
          onToken={(t) => {
            turnstileCallback(t); 
          }}
        />

        {/* 4. Button dropped startContent & color. Icons go in children. */}
        <Button
          fullWidth
          isDisabled={loading}
          type="submit"
          variant="primary"
        >
          {loading ? (
            <>
              <Spinner size="sm" />
              <span>Logging in...</span>
            </>
          ) : (
            <>
              <Key size={16} />
              <span>Login</span>
            </>
          )}
        </Button>

        <p className="text-center text-xs text-default-400">
          Don’t have an account?{" "}
          <Link className="text-primary hover:underline" href="/signup">
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
}
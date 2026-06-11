"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { 
  Button, 
  Input, 
  Spinner, 
  Alert, 
  TextField, 
  Label 
} from "@heroui/react";
import { Key } from "lucide-react";
import Link from "next/link";

import { signUp, authClient } from "@/lib/auth-client";
import TurnstileModal from "@/components/turnstileModal";

export default function CreateUserPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [unError, setUsernameError] = useState("");

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertVariant, setAlertVariant] = useState<
    "success" | "danger" | "warning"
  >("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [inviteEnabled, setInviteEnabled] = useState(false);

  const router = useRouter();

  const [turnstileCallback, setTurnstileCallback] = useState<
    (token: string) => void
  >(() => {});
  const [modalOpen, setModalOpen] = useState(false);

  // Username validation
  useEffect(() => {
    if (!username) {
      setUsernameError("");
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const { data: response } = await authClient.isUsernameAvailable({
          username: username,
        });

        if (response?.available) {
          setUsernameError("");
        } else {
          setUsernameError("Username is not available");
        }
      } finally {
        // e
      }
    }, 750);

    return () => clearTimeout(timeout);
  }, [username]);

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    showAlert("", "", alertVariant, false);

    if (password !== passwordConf) {
      showAlert(
        "Account creation failed",
        "The passwords you entered do not match. Please try again.",
        "warning",
      );
      setLoading(false);
      return;
    }

    try {
      const token = await waitForTurnstile();
      const { data, error } = await signUp.email(
        {
          username,
          email,
          password,
          name: "",
          displayUsername: displayName,
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
          "Sign-up failed",
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

      if (!error && data) {
        setEmail("");
        setPassword("");
        setPasswordConf("");
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

  // Is site closed?
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_INVITE_ENABLED === "true") {
      setInviteEnabled(true);
    }
  }, []);

  if (process.env.NEXT_PUBLIC_AUTH_DISABLED === "true") {
    return (
      <div>
        {/* Disabled Auth Alert updated to v3 Compound Component */}
        <Alert status="danger">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Sign ups are currently disabled</Alert.Title>
            <Alert.Description>
              You are not able to create a new account at this time. Please try again later.
            </Alert.Description>
          </Alert.Content>
        </Alert>

        <p className="pt-3 text-center text-xs text-default-400">
          Already chat with us?{" "}
          <Link className="text-primary hover:underline" href="/login">
            Sign In
          </Link>
        </p>
        
        {!inviteEnabled ? null : (
          <Button
            //as={Link}
            className="mt-4"
            //href="/invite"
            variant="primary"
          >
            I have an invite code
          </Button>
        )}
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleCreate}>
      {/* Form Alert updated to v3 Compound Component */}
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
        <h1 className="text-xl font-semibold">Create an account</h1>
        <p className="text-sm text-default-500">
          Lets create an account for you to get chatting!
        </p>
      </div>

      <div className="space-y-4">
        {/* Inputs mapped to TextField architecture with fixed onChange */}
        <TextField
          isRequired
          type="text"
          value={displayName}
          onChange={setDisplayName}
        >
          <Label>Display Name</Label>
          <Input placeholder="a super cool person!" />
          <p className="text-xs text-default-400 mt-1">
            This is how others see you, you can use special characters!!
          </p>
        </TextField>

        <TextField
          isRequired
          isInvalid={!!unError}
          type="text"
          value={username}
          onChange={setUsername}
        >
          <Label>Username</Label>
          <Input placeholder="gamer123" />
          <p className="text-xs text-default-400 mt-1">
            This is your username, it must be unique and can only contain letters, numbers, dots, underscores, and hyphens.
          </p>
          {unError && <p className="text-xs text-danger mt-1">{unError}</p>}
        </TextField>

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

        <TextField
          isRequired
          type="password"
          value={passwordConf}
          onChange={setPasswordConf}
        >
          <Label>Confirm Password</Label>
          <Input placeholder="••••••••" />
        </TextField>

        <TurnstileModal
          open={modalOpen}
          onToken={(t) => {
            turnstileCallback(t);
          }}
        />

        <Button
          fullWidth
          isDisabled={loading}
          type="submit"
          variant="primary"
        >
          {loading ? (
            <>
              <Spinner size="sm" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <Key size={16} />
              <span>Create Account</span>
            </>
          )}
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
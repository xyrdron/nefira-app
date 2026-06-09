"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Input, Checkbox, Spinner, Alert } from "@heroui/react";
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
      setModalOpen(true); // show modal
      const handler = (token: string) => {
        setModalOpen(false); // hide modal
        resolve(token); // resolve promise with token
      };

      setTurnstileCallback(() => handler);
    });
  }

  const handleSignIn = async (e: { preventDefault: () => void }) => {
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
        // No user returned
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
      <Alert
        color={alertVariant}
        description={alertMessage}
        isVisible={alertVisible}
        title={alertTitle}
        variant="faded"
      />
      <div className="space-y-2 text-center">
        <h1 className="text-xl font-semibold">Welcome back!</h1>
        <p className="text-sm text-default-500">
          Sign into your account to begin chatting!
        </p>
      </div>

      <div className="space-y-3">
        <Input
          isRequired
          label="Email"
          placeholder="gamer@nefira.xyz"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          isRequired
          label="Password"
          placeholder="••••••••"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex items-center gap-2">
          <Checkbox
            isSelected={rememberMe}
            size="sm"
            onValueChange={setRememberMe}
          >
            Remember me
          </Checkbox>
        </div>
        <TurnstileModal
          open={modalOpen}
          onToken={(t) => {
            turnstileCallback(t); // call the current callback
          }}
        />

        <Button
          fullWidth
          color="primary"
          isDisabled={loading}
          startContent={!loading ? <Key size={16} /> : undefined}
          type="submit"
        >
          {loading ? <Spinner color="white" size="sm" /> : "Login"}
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

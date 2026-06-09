"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button, Input, Spinner, Alert } from "@heroui/react";
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
      setModalOpen(true); // show modal
      const handler = (token: string) => {
        setModalOpen(false); // hide modal
        resolve(token); // resolve promise with token
      };

      setTurnstileCallback(() => handler);
    });
  }

  const handleCreate = async (e: { preventDefault: () => void }) => {
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
        // No user returned
        showAlert(
          "There is a problem with your account",
          "Please contact support for information",
          "danger",
        );
      }

      if (error) {
        //setMessage({
        //text: error.message || "Failed to create user.",
        //type: "error",
        //});
      } else if (data) {
        //setMessage({ text: "User created successfully!", type: "success" });
        setEmail("");
        setPassword("");
      }
    } catch {
      //setMessage({ text: "Unexpected error occurred.", type: "error" });
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
        <Alert
          color="danger"
          description="You are not able to create a new account at this time. Please try again later."
          title="Sign ups are currently disabled"
          variant="faded"
        />
        <p className="pt-3 text-center text-xs text-default-400">
          Already chat with us?{" "}
          <Link className="text-primary hover:underline" href="/login">
            Sign In
          </Link>
        </p>
        <Button
          as={Link}
          className="mt-4"
          color="primary"
          hidden={!inviteEnabled}
          href="/invite"
        >
          I have an invite code
        </Button>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleCreate}>
      <Alert
        color={alertVariant}
        description={alertMessage}
        isVisible={alertVisible}
        title={alertTitle}
        variant="faded"
      />
      <div className="space-y-2 text-center">
        <h1 className="text-xl font-semibold">Create an account</h1>
        <p className="text-sm text-default-500">
          Lets create an account for you to get chatting!
        </p>
      </div>

      <div className="space-y-3">
        <Input
          isRequired
          description="This is how others see you, you can use special characters!!"
          label="Display Name"
          placeholder="a super cool person!"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <Input
          isRequired
          description="This is your username, it must be unique and can only contain letters, numbers, dots, underscores, and hyphens."
          errorMessage={unError}
          isInvalid={!!unError}
          label="Username"
          placeholder="gamer123"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
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

        <Input
          isRequired
          label="Confirm Password"
          placeholder="••••••••"
          type="password"
          value={passwordConf}
          onChange={(e) => setPasswordConf(e.target.value)}
        />

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
          {loading ? <Spinner color="white" size="sm" /> : "Create Account"}
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

"use client";

import { useEffect } from "react";
import { Spinner, Alert } from "@heroui/react";
import { useParams, notFound, useRouter } from "next/navigation";

import { loadDynamicComponent } from "@/lib/loadDynamic";
import { authClient } from "@/lib/auth-client";

const sign_up = "@/components/auth/sign-up";
const sign_in = "@/components/auth/sign-in";
const invite_otp = "@/components/auth/invite-otp";
const forgot_password = "@/components/auth/forgot-password";

export default function AuthPage() {
  const router = useRouter();
  const { action } = useParams();

  // Hooks at the top level
  const { data: session, isPending, error } = authClient.useSession();

  useEffect(() => {
    if (!isPending && session?.user) {
      router.push("/app/home");
    }
  }, [isPending, session, router]);

  // Handle logout immediately
  if (action === "logout") {
    authClient.signOut();

    return (
      <div className="space-y-2 text-center">
        <h1 className="text-xl font-semibold">You have signed out</h1>
        <p className="text-sm text-default-500">Thank you for using Nefira!</p>
      </div>
    );
  }

  // Handle login/signup pages
  if (
    action === "login" ||
    action === "signup" ||
    action === "invite" ||
    action === "reset"
  ) {
    if (isPending) return (
      <div className="flex justify-center items-center">
        <Spinner size="xl" />
      </div>
    );

    if (error)
      return (
        <Alert
          color="danger"
          description={`${error.message}`}
          title="An unexpected error occurred"
          variant="faded"
        />
      );

    if (session?.user) return (
      <div className="flex justify-center items-center">
        <Spinner size="xl" />
      </div>
    );

    if (action === "signup") {
      const SignUp = loadDynamicComponent(() => import(sign_up));

      return <SignUp />;
    }

    if (action === "login") {
      const SignIn = loadDynamicComponent(() => import(sign_in));

      return <SignIn />;
    }

    if (action === "invite") {
      const InviteOtp = loadDynamicComponent(() => import(invite_otp));

      return <InviteOtp />;
    }

    if (action === "reset") {
      const ForgotPassword = loadDynamicComponent(
        () => import(forgot_password),
      );

      return <ForgotPassword />;
    }
  }

  notFound();
}

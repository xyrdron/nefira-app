"use client";

import { Modal, Link, Alert, Button } from "@heroui/react";
import { useRouter } from "next/navigation";

import { title, subtitle } from "@/components/primitives";

export default function Home() {
  const router = useRouter();
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title({ color: "violet" })}>Nefira</span>
        <div className={subtitle({ class: "" })}>
          The gamer chat app of the future, built for the community :D
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          isExternal
          onPress={() => {}}
        >
          Sign up
        </Button>
        <Button
          variant="outline"
          onPress={() => router.push("/login")}
        >
          Sign in
        </Button>
      </div>
    </section>
  );
}

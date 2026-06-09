"use client";

import dynamic from "next/dynamic";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/react";
const Turnstile = dynamic(
  () => import("@marsidev/react-turnstile").then((mod) => mod.Turnstile),
  { ssr: false },
);

type TurnstileModalProps = {
  open: boolean;
  onToken: (token: string) => void;
};

export default function TurnstileModal({ open, onToken }: TurnstileModalProps) {
  const { isOpen, onOpenChange } = useDisclosure({ defaultOpen: open });

  // Sync external `open` prop with HeroUI disclosure
  if (open && !isOpen) onOpenChange();
  if (!open && isOpen) onOpenChange();

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Verification Required
            </ModalHeader>
            <ModalBody className="flex flex-col items-center justify-center gap-4 p-6">
              <p>Please complete the verification</p>
              <Turnstile
                siteKey={
                  process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY! ||
                  "1x00000000000000000000AA"
                }
                onSuccess={(token: string) => {
                  onToken(token);
                  onOpenChange();
                }}
              />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

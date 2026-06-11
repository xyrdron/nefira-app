"use client";

import dynamic from "next/dynamic";
import { Modal } from "@heroui/react";

const Turnstile = dynamic(
  () => import("@marsidev/react-turnstile").then((mod) => mod.Turnstile),
  { ssr: false },
);

type TurnstileModalProps = {
  open: boolean;
  onToken: (token: string) => void;
  onClose?: () => void;
};

export default function TurnstileModal({ open, onToken, onClose }: TurnstileModalProps) {
  return (
    <Modal
      isOpen={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && onClose) {
          onClose();
        }
      }}
    >
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog>
            
            {/* Optional: Add <Modal.CloseTrigger /> here if you want an 'X' button */}

            <Modal.Header className="flex flex-col gap-1">
              {/* v3 introduces Modal.Heading for accessible titles inside headers */}
              <Modal.Heading>Verification Required</Modal.Heading>
            </Modal.Header>
            
            <Modal.Body className="flex flex-col items-center justify-center gap-4 p-6">
              <p>Please complete the verification</p>
              <Turnstile
                siteKey={
                  process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY ||
                  "1x00000000000000000000AA"
                }
                onSuccess={(token: string) => {
                  onToken(token);
                }}
              />
            </Modal.Body>

          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
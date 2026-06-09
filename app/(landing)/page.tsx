"use client";

import { Link } from "@heroui/link";
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalContent,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Alert } from "@heroui/alert";
import { button as buttonStyles } from "@heroui/theme";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

import { title, subtitle } from "@/components/primitives";

export default function Home() {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              {process.env.NEXT_PUBLIC_AUTH_DISABLED === "true" ? (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    We are sorry!
                  </ModalHeader>
                  <Alert color="danger" variant="faded">
                    <p className="font-medium">
                      Sign ups are currently disabled.
                    </p>
                  </Alert>
                  <ModalBody>
                    <p>
                      You are not able to create a new account at this time.
                      Please try again later.
                    </p>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" variant="light" onPress={onClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </>
              ) : (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Data privacy notice - Nefira (Indev)
                  </ModalHeader>
                  <Alert color="warning" variant="faded">
                    <p className="font-medium">
                      This is a development version of Nefira. Please read the
                      notice below carefully before proceeding.
                    </p>
                  </Alert>
                  <ModalBody>
                    <p>
                      Nefira is still in development. Features may not work as
                      expected and data may be lost. We will not be announcing
                      any breaking changes or changes to the database at this
                      point in time. Your data privacy is also not guaranteed.
                      Use at your own risk.
                    </p>
                    <p>
                      You need to be logged in to access Nefira. If you do not
                      have an account, please sign up first, however sign ups
                      are currently disabled unless you provide an invite code
                      from an administrator.
                    </p>
                    <p>
                      By using the application you agree that at this point in
                      time your data may be at risk and that we do not guarantee
                      its security, Mizook HQ and Xyrdron will not be held
                      liable for incidents. We recommend not using any sensitive
                      information while using Nefira until it is out of
                      development.
                    </p>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button
                      color="danger"
                      onPress={() => {
                        router.push("/signup");
                      }}
                    >
                      Action
                    </Button>
                  </ModalFooter>
                </>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title({ color: "violet" })}>Nefira</span>
        <div className={subtitle({ class: "" })}>
          The gamer chat app of the future, built for the community :D
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          isExternal
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          onPress={onOpen}
        >
          Sign up
        </Link>
        <Link
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "bordered",
          })}
          href="/login"
        >
          Sign in
        </Link>
      </div>
    </section>
  );
}

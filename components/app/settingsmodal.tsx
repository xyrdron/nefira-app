import {
  Modal,
  Button,
  Form,
  TextField,
  Label,
  Input,
  FieldError,
} from "@heroui/react";
import { useSession, authClient } from "@/lib/auth-client";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [username, setUsername] = useState("");
  const [unError, setUsernameError] = useState("");
  const session = useSession();

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

  const changeUsername = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await authClient.updateUser({
        username: username,
      });
      onClose();
    } catch (error) {
      console.error("Failed to change username:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <Modal.Backdrop>
        <Modal.Container placement="center">
          <Modal.Dialog>
            <Modal.Header>Settings - Account</Modal.Header>
            <Modal.Body>
              <p>
                {session?.data?.user?.displayUsername} @
                {session?.data?.user?.username}
              </p>
              <p>Email: {session?.data?.user?.email}</p>
              <Form
                onSubmit={(e) =>
                  changeUsername(
                    e as unknown as React.SubmitEvent<HTMLFormElement>,
                  )
                }
              >
                <TextField
                  isRequired
                  name="Username"
                  type="text"
                  className="w-full mt-4"
                  isInvalid={!!unError}
                  value={username}
                  onChange={setUsername}
                >
                  <Label>Update username</Label>
                  <Input
                    placeholder={"@" + session?.data?.user?.username || "@"}
                  />
                  {unError && <p className="text-xs text-danger mt-1">{unError}</p>}
                  <FieldError />
                </TextField>
                <Button type="submit" className="w-full mt-4">
                  <Check />
                  Submit
                </Button>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline" onPress={onClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

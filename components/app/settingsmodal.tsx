import { Modal, Button } from "@heroui/react";
import { useSession } from "@/lib/auth-client";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const session = useSession();
  console.log(session);

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <Modal.Backdrop>
      <Modal.Container placement="center">
        <Modal.Dialog>
          <Modal.Header>Settings - Account</Modal.Header>
          <Modal.Body>
            <p>Email: {session?.data?.user?.email}</p>
            <p>Username: {session?.data?.user?.username}</p>
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

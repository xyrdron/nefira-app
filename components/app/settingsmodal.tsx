import { Modal, Button } from "@heroui/react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <Modal.Backdrop>
      <Modal.Container placement="center">
        <Modal.Dialog>
          <Modal.Header>Settings - Account</Modal.Header>
          <Modal.Body>work in progress</Modal.Body>
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

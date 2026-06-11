"use client";

import { useEffect, useState } from "react";
import { Modal, Button, Avatar, Spinner } from "@heroui/react";

interface User {
  id: string;
  username: string;
  displayUsername?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string; // ISO string
  roles?: string[]; // e.g., ["staff", "premium"]
}

interface ProfileModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({
  userId,
  isOpen,
  onClose,
}: ProfileModalProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/users?id=${userId}`);

        if (!res.ok) throw new Error();
        const data = await res.json();

        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, isOpen]);

  const formatJoinDate = (dateStr: string) => {
    const d = new Date(dateStr);

    return `Joined ${d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`;
  };

  const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

  // Staff/System Badge
  let hasStaffBadge = false;
  let hasSystemBadge = false;

  if (user?.username === "nefira") {
    hasSystemBadge = true;
  }

  if (user?.username === "mizook") {
    hasStaffBadge = true;
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <Modal.Backdrop className="fixed inset-0 z-50 bg-black/50" />
      <Modal.Container placement="center" className="fixed inset-0 z-50 flex items-center justify-center">
        <Modal.Dialog>
          <Modal.Header className="flex gap-3 items-center">
            {user && (
              <Avatar size="lg">
                <Avatar.Image
                  src={user.avatarUrl}
                  alt={user.displayUsername || user.username}
                />
                <Avatar.Fallback>
                  {getInitials(user.displayUsername || user.username)}
                </Avatar.Fallback>
              </Avatar>
            )}
            <div className="flex flex-col flex-1">
              <span className="font-bold text-lg">
                {user?.displayUsername || user?.username || "Unknown User"}
              </span>
              <span className="text-sm text-default-500">
                @{user?.username}
              </span>
            </div>
          </Modal.Header>

          <Modal.Body>
            {loading && (
              <div className="flex justify-center py-6">
                <Spinner size="lg" />
              </div>
            )}

            {!loading && user && (
              <div className="flex flex-col gap-4">
                {/* Horizontal info box */}
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                  {/* Left: Badge */}
                  {hasStaffBadge && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      NEFIRA STAFF
                    </span>
                  )}
                  {hasSystemBadge && (
                    <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded ml-2">
                      SYSTEM
                    </span>
                  )}

                  {/* Join date */}
                  <span
                    className={`text-sm text-default-500 ${
                      hasStaffBadge ? "ml-auto" : ""
                    }`}
                  >
                    {formatJoinDate(user.createdAt)}
                  </span>
                </div>

                {/* Bio */}
                <div>
                  <p className="text-sm text-default-500">About</p>
                  <p className="text-default-800">
                    {user.bio || "This user hasn't written a bio yet."}
                  </p>
                </div>
              </div>
            )}

            {!loading && !user && (
              <p className="text-danger text-center">
                Unable to load user profile.
              </p>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="outline" onPress={onClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal>
  );
}
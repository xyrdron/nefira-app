"use client";

import { Card, Button, Spinner, Alert, buttonVariants } from "@heroui/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

import { authClient } from "@/lib/auth-client";
import Chatbox from "@/components/app/chatbox";
import SettingsModal from "@/components/app/settingsmodal";

export default function ChatLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, isPending, error } = authClient.useSession();

  const [channels, setChannels] = useState<any[]>([]);
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [settings, openSettings] = useState(false);

  const hasLoadedChannels = useRef(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [isPending, session?.user, router]);

  // Load channels ONCE
  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId || hasLoadedChannels.current) return;

    hasLoadedChannels.current = true;

    async function loadChannels() {
      try {
        const res = await fetch(`/api/channels?server=test`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch channels");

        const data = await res.json();
        setChannels(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingChannels(false);
      }
    }

    loadChannels();
  }, [session?.user?.id]);

  // Derive active channel FROM URL (no state)
  const activeChannel =
    pathname?.split("/").pop() === "home"
      ? null
      : (pathname?.split("/").pop() ?? null);

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-black">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        {/* v3 Compound Alert */}
        <Alert status="danger">
          {" "}
          //variant="faded"
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>
              Nefira crashed unexpectedly, please refresh the page and try
              again.
            </Alert.Title>
            <Alert.Description>{error.message}</Alert.Description>
          </Alert.Content>
        </Alert>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-black">
        <Spinner size="lg" />
      </div>
    );
  }

  const dmButtons = [
    { label: "Home", channelId: null },
    ...channels.map((channel) => ({
      label: `#${channel.name}`,
      channelId: channel.id,
    })),
  ];

  return (
    <div className="flex h-screen w-screen bg-black p-3 gap-3">
      {/* Server List */}
      <Card className="w-16 h-full flex-shrink-0 rounded-2xl">
        {/* v3 Card uses Card.Content instead of CardBody */}
        <Card.Content className="flex flex-col items-center justify-start gap-3 py-4">
          <div className="w-10 h-10 bg-default-200 rounded-full" />
          <div className="w-10 h-10 bg-default-200 rounded-full" />
          <div className="w-10 h-10 bg-default-200 rounded-full" />
        </Card.Content>
      </Card>

      {/* Channel List */}
      <Card className="w-64 h-full flex-shrink-0 rounded-2xl">
        {/* v3 Card uses Card.Content instead of CardBody */}
        <Card.Content className="flex flex-col gap-3 overflow-y-auto">
          {loadingChannels ? (
            <div className="flex justify-center items-center">
              <Spinner size="xl" />
            </div>
          ) : (
            dmButtons.map((dm) => (
              <Button
                key={dm.channelId ?? "home"}
                className="justify-start p-4 w-full rounded-xl"
                size="lg"
                variant={activeChannel === dm.channelId ? "primary" : "outline"}
                onPress={() => {
                  router.push(
                    dm.channelId ? `/app/${dm.channelId}` : "/app/home",
                  );
                }}
              >
                {dm.label}
              </Button>
            ))
          )}
          <Button variant="primary" onClick={() => openSettings(true)}>
            Settings
          </Button>
        </Card.Content>
      </Card>

      {/* Chat */}
      <div className="flex flex-col flex-1 min-h-0 gap-3 overflow-hidden">
        {activeChannel ? (
          <Chatbox channelId={activeChannel} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-default-50 rounded-2xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2">Welcome to Nefira!</h1>
              <p className="text-lg text-gray-200">Choose a channel to start</p>
            </div>
          </div>
        )}
      </div>
      {settings && (
        <SettingsModal isOpen={true} onClose={() => openSettings(false)} />
      )}
    </div>
  );
}

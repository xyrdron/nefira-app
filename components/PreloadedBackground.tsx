"use client";
import { useState, useEffect } from "react";

export default function PreloadedBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();

    img.src = "/auth-bg.png";
    img.onload = () => setLoaded(true);
  }, []);

  if (!loaded) {
    return <div className="flex items-center justify-center h-screen" />;
  }

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat !p-0 !m-0"
      style={{ backgroundImage: "url('/auth-bg.png')" }}
    >
      {children}
    </div>
  );
}

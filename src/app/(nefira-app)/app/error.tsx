"use client";

import { useEffect } from "react";
import { Alert } from "@heroui/react";

export default function Error({ error }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    /* eslint-disable no-console */
    console.error(error);
  }, [error]);

  return (
    <div className="relative flex flex-col h-screen">
      <main className=" px-0 lg:px-0 mx-auto flex flex-col items-start h-full overflow-visible">
        <div className="flex items-center justify-center h-screen bg-black">
          <Alert
            color="danger"
            //description={`${error.message}`}
            title="Nefira crashed unexpectedly, please refresh the page and try again."
            //variant="faded"
          ><p>An unexpected error occurred</p></Alert>
        </div>
      </main>
    </div>
  );
}

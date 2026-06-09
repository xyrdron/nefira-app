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
    <Alert
      color="danger"
      description={`${error.message}`}
      title="An unexpected error occurred"
      variant="faded"
    />
  );
}

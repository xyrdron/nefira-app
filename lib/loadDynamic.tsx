// lib/loadDynamic.tsx
import type { ComponentType } from "react";

import dynamic, { type Loader } from "next/dynamic";
import { Spinner } from "@heroui/react";

export function loadDynamicComponent<Props = {}>(
  importFn: Loader<any>,
  { ssr = false } = {},
): ComponentType<Props> {
  return dynamic(importFn as Loader<any>, {
    loading: () => <Spinner size="lg" />,
    ssr,
  }) as unknown as ComponentType<Props>;
}

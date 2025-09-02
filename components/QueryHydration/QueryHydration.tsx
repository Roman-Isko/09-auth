"use client";

import { HydrationBoundary } from "@tanstack/react-query";
import type { DehydratedState } from "@tanstack/react-query";

export default function QueryHydration({
  state,
  children,
}: {
  state: DehydratedState;
  children: React.ReactNode;
}) {
  return <HydrationBoundary state={state}>{children}</HydrationBoundary>;
}

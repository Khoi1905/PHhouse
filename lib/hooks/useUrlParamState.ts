"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Mirrors a single query param into browser history via the raw History API
 * (not next/navigation's router) so opening/closing doesn't trigger a Server
 * Component re-fetch on every tap — only a real `router.push` would do that,
 * since this route's page.tsx reads `searchParams` for its Supabase query.
 * Back button (or swipe-back on mobile) closes via the resulting `popstate`,
 * instead of leaving the page entirely.
 */
export function useUrlParamState(paramName: string) {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    setValue(new URLSearchParams(window.location.search).get(paramName));

    function onPopState() {
      setValue(new URLSearchParams(window.location.search).get(paramName));
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [paramName]);

  const open = useCallback(
    (id: string) => {
      const params = new URLSearchParams(window.location.search);
      params.set(paramName, id);
      window.history.pushState(null, "", `${window.location.pathname}?${params.toString()}`);
      setValue(id);
    },
    [paramName]
  );

  const close = useCallback(() => {
    window.history.back();
  }, []);

  return { value, open, close };
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Mirrors a single query param into browser history via the raw History API
 * (not next/navigation's router) so opening/closing doesn't trigger a Server
 * Component re-fetch on every tap — only a real `router.push` would do that,
 * since this route's page.tsx reads `searchParams` for its Supabase query.
 * Back button (or swipe-back on mobile) closes via the resulting `popstate`,
 * instead of leaving the page entirely.
 *
 * close() has two paths on purpose (pushedRef): if THIS hook pushed the entry
 * (user tapped a row), go back so Back and the X button stay symmetric and no
 * orphan history entry is left behind. But when the page was loaded straight
 * at ?param=... (shared link, new tab, bookmark) there is no entry of ours to
 * pop — calling back() there would leave the site entirely, so strip the param
 * with replaceState instead and stay put.
 */
export function useUrlParamState(paramName: string) {
  const [value, setValue] = useState<string | null>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    setValue(new URLSearchParams(window.location.search).get(paramName));

    function onPopState() {
      // Going back consumed our pushed entry (if any).
      pushedRef.current = false;
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
      pushedRef.current = true;
      setValue(id);
    },
    [paramName]
  );

  const close = useCallback(() => {
    if (pushedRef.current) {
      // popstate handler above resets the ref and clears value.
      window.history.back();
      return;
    }

    const params = new URLSearchParams(window.location.search);
    params.delete(paramName);
    const qs = params.toString();
    window.history.replaceState(
      null,
      "",
      qs ? `${window.location.pathname}?${qs}` : window.location.pathname
    );
    setValue(null);
  }, [paramName]);

  return { value, open, close };
}

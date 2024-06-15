"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

export function SearchParamsHandler() {
  const router = useRouter();
  const path = usePathname();
  const params = useSearchParams();

  const errorMessage = params.get("error_message");

  useEffect(() => {
    if (errorMessage) {
      router.push(path);
      toast.error(errorMessage);
    }
  }, [errorMessage, path, router]);

  return null;
}

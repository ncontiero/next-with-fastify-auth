"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

export function SearchParamsHandler() {
  const router = useRouter();
  const path = usePathname();
  const params = useSearchParams();

  const errorMessage = params.get("error_message");
  const successMessage = params.get("success_message");

  useEffect(() => {
    if (errorMessage) {
      router.push(path);
      toast.error(errorMessage);
    }
    if (successMessage) {
      router.push(path);
      toast.success(successMessage);
    }
  }, [errorMessage, path, router, successMessage]);

  return null;
}

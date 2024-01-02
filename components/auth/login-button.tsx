"use client";

import { memo, useCallback } from "react";
import { useRouter } from "next/navigation";

interface IProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

export const LoginButton = memo(_LoginButton);
function _LoginButton({ children, asChild, mode = "redirect" }: IProps) {
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push("/auth/login");
  }, [router]);

  if (mode === "modal") {
    return <span>{"TODO: Implement modal"}</span>;
  }

  return (
    <span onClick={handleClick} className="cursor-pointer">
      {children}
    </span>
  );
}

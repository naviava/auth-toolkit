"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { Button } from "~/components/ui/button";

export function Social() {
  return (
    <div className="flex w-full items-center gap-x-2">
      <Button size="lg" variant="outline" onClick={() => {}} className="w-full">
        <FcGoogle />
      </Button>
      <Button size="lg" variant="outline" onClick={() => {}} className="w-full">
        <FaGithub />
      </Button>
    </div>
  );
}

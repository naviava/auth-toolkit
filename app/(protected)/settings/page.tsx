"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { useCurrentUser } from "~/hooks/use-current-user";

export default function SettingsPage() {
  const user = useCurrentUser();

  return (
    <div className="rounded-xl bg-white p-10">
      <Button onClick={() => signOut()} type="submit">
        Sign out
      </Button>
    </div>
  );
}

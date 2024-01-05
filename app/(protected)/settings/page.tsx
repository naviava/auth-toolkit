"use client";

import { useSession } from "next-auth/react";
import { useCallback, useTransition } from "react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

import { settings } from "~/utils/actions/settings";

export default function SettingsPage() {
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const handleClick = useCallback(() => {
    startTransition(() => {
      // IMPORTANT: Session needs to be updated to reflect the new settings.
      settings({ name: "Something else" }).then(() => {
        update();
      });
    });
  }, [update]);

  return (
    <Card className="max-w-[600px]">
      <CardHeader>
        <p className="text-center text-2xl font-semibold">⚙️Settings</p>
      </CardHeader>
      <CardContent>
        <Button onClick={handleClick} disabled={isPending}>
          Update name
        </Button>
      </CardContent>
    </Card>
  );
}

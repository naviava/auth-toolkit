"use client";

import { useCurrentRole } from "~/hooks/use-current-role";

import { Button } from "~/components/ui/button";
import { RoleGate } from "~/components/auth/role-gate";
import { FormSuccess } from "~/components/form-success";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

export default function AdminPage() {
  const role = useCurrentRole();

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-center text-2xl font-semibold">🔑Admin</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole="ADMIN">
          <FormSuccess message="You are allowed to see this content!" />
        </RoleGate>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only API Routes</p>
          <Button>Click to test</Button>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only Server Action</p>
          <Button>Click to test</Button>
        </div>
      </CardContent>
    </Card>
  );
}

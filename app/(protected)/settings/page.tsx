"use client";

import { useCallback, useState, useTransition } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useCurrentUser } from "~/hooks/use-current-user";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

import { settingsSchema } from "~/schemas";
import { settings } from "~/utils/actions/settings";
import { FormError } from "~/components/form-error";
import { FormSuccess } from "~/components/form-success";

export default function SettingsPage() {
  const { update } = useSession();
  const user = useCurrentUser();
  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: user?.name || undefined,
    },
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof settingsSchema>) => {
      startTransition(() => {
        // IMPORTANT: Session needs to be updated to reflect the new settings.
        settings(values)
          .then((data) => {
            if (data.error) setError(data.error);
            if (data.success) {
              update();
              setSuccess(data.success);
            }
          })
          .catch(() => setError("Something went wrong."));
      });
    },
    [update],
  );

  return (
    <Card className="max-w-[600px]">
      <CardHeader>
        <p className="text-center text-2xl font-semibold">⚙️Settings</p>
      </CardHeader>
      <CardContent className="w-[600px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="John Doe"
                        disabled={isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button type="submit" disabled={isPending}>
              Save
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

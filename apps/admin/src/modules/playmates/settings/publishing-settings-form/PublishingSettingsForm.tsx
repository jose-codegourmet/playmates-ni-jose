"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@fe-template/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { savePublishingSettings } from "@/app/(dashboard)/settings/publishing/actions";

import { getPublishingSettingsDefaultValues } from "./PublishingSettingsForm.defaults";
import {
  type PublishingSettingsFormValues,
  publishingSettingsSchema,
} from "./PublishingSettingsForm.schema";
import type { PublishingSettingsFormProps } from "./PublishingSettingsForm.types";

function PublishingSettingsForm({ settings }: PublishingSettingsFormProps) {
  const form = useForm<PublishingSettingsFormValues>({
    resolver: zodResolver(publishingSettingsSchema),
    defaultValues: getPublishingSettingsDefaultValues(settings),
  });

  useEffect(() => {
    form.reset(getPublishingSettingsDefaultValues(settings));
  }, [form, settings]);

  async function onSubmit(values: PublishingSettingsFormValues) {
    let result: Awaited<ReturnType<typeof savePublishingSettings>>;
    try {
      result = await savePublishingSettings(values);
    } catch {
      toast.error("Could not save publishing settings.");
      return;
    }
    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(result.message);
  }

  return (
    <Card
      size="sm"
      data-slot="publishing-settings"
      className="mx-auto max-w-xl gap-0 bg-background text-foreground"
    >
      <CardHeader className="border-b border-border px-(--card-spacing) py-3">
        <CardTitle>Publishing</CardTitle>
        <CardDescription>
          Stored in mock memory. Default hashtags are appended to Facebook Group drafts.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-(--card-spacing) py-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="facebookGroupUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook Group URL</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" inputMode="url" placeholder="https://" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="defaultHashtags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default hashtags</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Save publishing settings"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export type { PublishingSettingsFormProps };
export { PublishingSettingsForm };

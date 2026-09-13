"use client";

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  NativeSelect,
  NativeSelectOption,
  Textarea,
} from "@fe-template/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { updateSession } from "@/app/(dashboard)/sessions/actions";
import { StatusBadge } from "@/modules/playmates/status-badge/StatusBadge";

import { getSessionDetailsFormDefaultValues } from "./SessionDetailsForm.defaults";
import {
  SESSION_DETAILS_STATUSES,
  type SessionDetailsFormValues,
  sessionDetailsFormSchema,
} from "./SessionDetailsForm.schema";
import type { SessionDetailsFormProps } from "./SessionDetailsForm.types";

function SessionDetailsForm({
  sessionId,
  slug,
  venues,
  courts,
  defaultValues,
}: SessionDetailsFormProps) {
  const router = useRouter();
  const form = useForm<SessionDetailsFormValues>({
    resolver: zodResolver(sessionDetailsFormSchema),
    defaultValues: getSessionDetailsFormDefaultValues(defaultValues),
  });

  const venueId = form.watch("venueId");
  const status = form.watch("status");
  const courtsForVenue = useMemo(
    () => courts.filter((court) => court.venueId === venueId),
    [courts, venueId],
  );
  const courtDisabled = venueId === "";

  async function onSubmit(values: SessionDetailsFormValues) {
    const result = await updateSession(sessionId, values);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Session details saved");
    form.reset(values);
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormItem>
          <FormLabel>Slug</FormLabel>
          <FormControl>
            <Input value={slug ?? ""} readOnly disabled />
          </FormControl>
        </FormItem>
        <FormField
          control={form.control}
          name="sessionDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input {...field} type="date" required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Optional session title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="venueId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venue</FormLabel>
              <FormControl>
                <NativeSelect
                  className="w-full"
                  value={field.value}
                  onChange={(event) => {
                    field.onChange(event.currentTarget.value);
                    form.setValue("courtId", "");
                  }}
                >
                  <NativeSelectOption value="">Select a venue</NativeSelectOption>
                  {venues.map((venue) => (
                    <NativeSelectOption key={venue.id} value={venue.id}>
                      {venue.name}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="courtId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Court</FormLabel>
              <FormControl>
                <NativeSelect
                  className="w-full"
                  value={field.value}
                  disabled={courtDisabled}
                  onChange={(event) => field.onChange(event.currentTarget.value)}
                >
                  <NativeSelectOption value="">
                    {courtDisabled ? "Select a venue first" : "Select a court"}
                  </NativeSelectOption>
                  {courtsForVenue.map((court) => (
                    <NativeSelectOption key={court.id} value={court.id}>
                      {court.name}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Visibility</FormLabel>
              <FormControl>
                <NativeSelect
                  className="w-full"
                  value={field.value}
                  onChange={(event) => field.onChange(event.currentTarget.value)}
                >
                  <NativeSelectOption value="private">Private</NativeSelectOption>
                  <NativeSelectOption value="public">Public</NativeSelectOption>
                </NativeSelect>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge kind="session" status={status} />
                <FormControl>
                  <NativeSelect
                    className="w-full max-w-xs"
                    value={field.value}
                    onChange={(event) => field.onChange(event.currentTarget.value)}
                  >
                    {SESSION_DETAILS_STATUSES.map((value) => (
                      <NativeSelectOption key={value} value={value}>
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </FormControl>
              </div>
              <p className="text-xs text-muted-foreground">
                Status is shown as a badge. The select is for prototype convenience only.
              </p>
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
              "Save details"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export type { SessionDetailsFormProps };
export { SessionDetailsForm };

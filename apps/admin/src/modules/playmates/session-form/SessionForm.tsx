"use client";

import {
  Button,
  Checkbox,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
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
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createSession } from "@/app/(dashboard)/sessions/actions";

import { getSessionFormDefaultValues } from "./SessionForm.defaults";
import { type SessionFormValues, sessionFormSchema } from "./SessionForm.schema";
import type { SessionFormProps } from "./SessionForm.types";

function SessionForm({ venues, courts, players, defaultValues }: SessionFormProps) {
  const form = useForm<SessionFormValues>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: getSessionFormDefaultValues(defaultValues),
  });

  const venueId = form.watch("venueId");
  const courtsForVenue = useMemo(
    () => courts.filter((court) => court.venueId === venueId),
    [courts, venueId],
  );
  const courtDisabled = venueId === "";

  async function onSubmit(values: SessionFormValues) {
    try {
      const result = await createSession(values);
      if (result?.success === false) {
        toast.error(result.error);
      }
    } catch {
      toast.error("Could not create session.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          name="playerIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Roster</FormLabel>
              <FormControl>
                {players.length === 0 ? (
                  <Empty className="min-h-0 border p-4">
                    <EmptyHeader>
                      <EmptyTitle>No active players</EmptyTitle>
                      <EmptyDescription>Add players first to include a roster.</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  <fieldset className="space-y-2 rounded-lg border border-input p-3">
                    <legend className="sr-only">Participating players</legend>
                    {players.map((player) => {
                      const checked = field.value.includes(player.id);
                      const inputId = `session-roster-${player.id}`;
                      return (
                        <div
                          key={player.id}
                          className="flex items-center gap-2 text-sm text-foreground"
                        >
                          <Checkbox
                            id={inputId}
                            checked={checked}
                            onCheckedChange={(next) => {
                              if (next === true) {
                                field.onChange([...field.value, player.id]);
                                return;
                              }
                              field.onChange(field.value.filter((id) => id !== player.id));
                            }}
                          />
                          <label htmlFor={inputId}>{player.displayName}</label>
                        </div>
                      );
                    })}
                  </fieldset>
                )}
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
                Creating…
              </>
            ) : (
              "Create session"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export type { SessionFormProps };
export { SessionForm };

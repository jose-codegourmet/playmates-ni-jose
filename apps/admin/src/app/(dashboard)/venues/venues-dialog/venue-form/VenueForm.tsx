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
  Textarea,
} from "@fe-template/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createVenue, updateVenue } from "../../actions";
import { getVenueFormDefaultValues } from "./VenueForm.defaults";
import { type VenueFormValues, venueFormSchema } from "./VenueForm.schema";
import type { VenueFormProps } from "./VenueForm.types";

function VenueForm({ venue, onSuccess }: VenueFormProps) {
  const form = useForm<VenueFormValues>({
    resolver: zodResolver(venueFormSchema),
    defaultValues: getVenueFormDefaultValues(venue),
  });

  useEffect(() => {
    form.reset(getVenueFormDefaultValues(venue));
  }, [form, venue]);

  async function onSubmit(values: VenueFormValues) {
    let result: Awaited<ReturnType<typeof createVenue>>;
    try {
      result = venue ? await updateVenue(venue.id, values) : await createVenue(values);
    } catch {
      toast.error("Could not save venue.");
      return;
    }

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(result.message);
    if (result.warning) toast.warning(result.warning);
    onSuccess?.();
  }

  const isEdit = Boolean(venue);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} autoComplete="organization" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} autoComplete="street-address" />
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
        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Saving…
              </>
            ) : isEdit ? (
              "Save venue"
            ) : (
              "Create venue"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export type { VenueFormProps };
export { VenueForm };

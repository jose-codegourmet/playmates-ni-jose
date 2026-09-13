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
} from "@fe-template/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { addCourt } from "../../actions";
import { addCourtFormDefaultValues } from "./AddCourtForm.defaults";
import { type AddCourtFormValues, addCourtFormSchema } from "./AddCourtForm.schema";
import type { AddCourtFormProps } from "./AddCourtForm.types";

function AddCourtForm({ venueId, onSuccess }: AddCourtFormProps) {
  const form = useForm<AddCourtFormValues>({
    resolver: zodResolver(addCourtFormSchema),
    defaultValues: addCourtFormDefaultValues,
  });

  async function onSubmit(values: AddCourtFormValues) {
    let result: Awaited<ReturnType<typeof addCourt>>;
    try {
      result = await addCourt(venueId, values);
    } catch {
      toast.error("Could not add court.");
      return;
    }

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(result.message);
    if (result.warning) toast.warning(result.warning);
    form.reset(addCourtFormDefaultValues);
    onSuccess?.();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Court name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Court 1" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
              <Loader2Icon className="size-4 animate-spin" />
              Adding…
            </>
          ) : (
            "Add court"
          )}
        </Button>
      </form>
    </Form>
  );
}

export type { AddCourtFormProps };
export { AddCourtForm };

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

import { createPlayer, updatePlayer } from "../../actions";
import { getPlayerFormDefaultValues } from "./PlayerForm.defaults";
import { type PlayerFormValues, playerFormSchema } from "./PlayerForm.schema";
import type { PlayerFormProps } from "./PlayerForm.types";

function PlayerForm({ player, onSuccess }: PlayerFormProps) {
  const form = useForm<PlayerFormValues>({
    resolver: zodResolver(playerFormSchema),
    defaultValues: getPlayerFormDefaultValues(player),
  });

  useEffect(() => {
    form.reset(getPlayerFormDefaultValues(player));
  }, [form, player]);

  async function onSubmit(values: PlayerFormValues) {
    let result: Awaited<ReturnType<typeof createPlayer>>;
    try {
      result = player ? await updatePlayer(player.id, values) : await createPlayer(values);
    } catch {
      toast.error("Could not save player.");
      return;
    }

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(result.message);
    onSuccess?.(result.player);
  }

  const isEdit = Boolean(player);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display name</FormLabel>
              <FormControl>
                <Input {...field} autoComplete="name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nickname</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="facebookName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facebook name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="facebookUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facebook URL</FormLabel>
              <FormControl>
                <Input {...field} type="url" inputMode="url" placeholder="https://" />
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
              "Save player"
            ) : (
              "Create player"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export type { PlayerFormProps };
export { PlayerForm };

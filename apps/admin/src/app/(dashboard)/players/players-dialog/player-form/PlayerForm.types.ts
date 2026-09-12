import type { PlayerFormSource } from "./PlayerForm.defaults";

export type PlayerFormProps = {
  player?: (PlayerFormSource & { id: string }) | null;
  onSuccess?: () => void;
};

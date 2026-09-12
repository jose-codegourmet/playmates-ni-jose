export type FacebookPostPreviewProps = {
  title?: string;
  body: string;
  onChange?: (body: string) => void;
  onCopy: () => void;
};

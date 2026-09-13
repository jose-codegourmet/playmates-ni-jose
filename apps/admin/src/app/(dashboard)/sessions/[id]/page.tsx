import { redirect } from "next/navigation";

type SessionWorkspacePageProps = {
  params: Promise<{ id: string }>;
};

export default async function SessionWorkspacePage({ params }: SessionWorkspacePageProps) {
  const { id } = await params;
  redirect(`/sessions/${id}/details`);
}

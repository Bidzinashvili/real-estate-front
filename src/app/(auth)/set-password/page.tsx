import { SetPasswordForm } from "@/features/auth/SetPasswordForm";

type SetPasswordPageProps = {
  searchParams: Promise<{ token?: string }>;
};

async function SetPasswordPage({ searchParams }: SetPasswordPageProps) {
  const params = await searchParams;
  return <SetPasswordForm token={params.token?.trim() ?? ""} />;
}

export default SetPasswordPage;

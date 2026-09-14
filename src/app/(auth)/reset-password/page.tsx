import { ResetPasswordForm } from "@/features/auth/ResetPasswordForm";

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string }>;
};

async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;
  return <ResetPasswordForm token={params.token?.trim() ?? ""} />;
}

export default ResetPasswordPage;

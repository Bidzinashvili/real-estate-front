import { SignInForm } from "@/features/auth";

type SignInPageProps = {
  searchParams: Promise<{ reason?: string }>;
};

async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;

  return <SignInForm noticeReason={params.reason ?? null} />;
}

export default SignInPage;

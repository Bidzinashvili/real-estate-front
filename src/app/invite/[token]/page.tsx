import { PublicClientInviteView } from "@/widgets/PublicClientInvite/PublicClientInviteView";
import { isUuidV4Token } from "@/features/clientInviteLinks/tokenValidation";

type InvitePageProps = {
  params: Promise<{ token: string }>;
};

export default async function InvitePage(props: InvitePageProps) {
  const { token } = await props.params;
  const trimmedToken = token.trim();

  if (!isUuidV4Token(trimmedToken)) {
    return (
      <div className="rounded-xl border border-amber-200 bg-warning-muted px-4 py-6 text-center text-sm text-amber-900">
        ეს მოწვევის ბმული არასწორია. შეამოწმეთ მისამართი ან სთხოვეთ აგენტს ახალი ბმული.
      </div>
    );
  }

  return <PublicClientInviteView inviteToken={trimmedToken} />;
}

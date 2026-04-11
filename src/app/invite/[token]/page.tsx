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
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-6 text-center text-sm text-amber-900">
        This invite link is not valid. Check the URL or ask your agent for a new link.
      </div>
    );
  }

  return <PublicClientInviteView inviteToken={trimmedToken} />;
}

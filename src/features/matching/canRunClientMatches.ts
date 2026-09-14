type MatchRunner = {
  id: string;
  role: "ADMIN" | "AGENT";
};

type MatchClientRef = {
  ownedByViewer?: boolean | null;
  userId?: string;
};

export function canRunClientMatches(
  user: MatchRunner | null | undefined,
  client: MatchClientRef | string,
): boolean {
  if (!user) {
    return false;
  }
  if (user.role === "ADMIN") {
    return true;
  }
  if (typeof client === "string") {
    return user.role === "AGENT" && user.id === client;
  }
  if (client.ownedByViewer === true) {
    return true;
  }
  if (client.ownedByViewer === false) {
    return false;
  }
  return user.role === "AGENT" && client.userId !== undefined && user.id === client.userId;
}

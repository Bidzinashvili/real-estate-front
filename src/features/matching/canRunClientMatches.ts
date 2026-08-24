type MatchRunner = {
  id: string;
  role: "ADMIN" | "AGENT";
};

export function canRunClientMatches(
  user: MatchRunner | null | undefined,
  clientUserId: string,
): boolean {
  if (!user) {
    return false;
  }
  if (user.role === "ADMIN") {
    return true;
  }
  return user.role === "AGENT" && user.id === clientUserId;
}

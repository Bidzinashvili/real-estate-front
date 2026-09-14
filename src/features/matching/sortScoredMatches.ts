type ScoredMatch = {
  matchPercentage: number;
};

export function sortScoredMatchesByPercentageDesc<Match extends ScoredMatch>(
  matches: Match[],
): Match[] {
  return [...matches].sort(
    (firstMatch, secondMatch) => secondMatch.matchPercentage - firstMatch.matchPercentage,
  );
}

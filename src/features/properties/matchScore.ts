export type MatchBooleanField = {
  key: string;
  label: string;
  value: boolean | null | undefined;
  expected?: boolean | null;
};

export type MatchScoreResult = {
  matched: number;
  total: number;
  percentage: number | null;
};

export function calculateMatchScore(
  fields: MatchBooleanField[],
  needsVerification: string[] = [],
): MatchScoreResult {
  const verificationSet = new Set(needsVerification);
  let matched = 0;
  let total = 0;

  for (const field of fields) {
    if (verificationSet.has(field.key)) {
      continue;
    }

    const expected = field.expected ?? true;
    total += 1;

    if (field.value === expected) {
      matched += 1;
    }
  }

  return {
    matched,
    total,
    percentage: total === 0 ? null : Math.round((matched / total) * 100),
  };
}

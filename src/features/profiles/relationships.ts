export interface FollowRelationship {
  followerId: string;
  followingId: string;
}
export function normaliseFollowing(
  value: unknown,
  currentId: string,
  knownIds: readonly string[],
): string[] {
  if (!Array.isArray(value)) return [];
  return [
    ...new Set(
      value.filter(
        (id): id is string =>
          typeof id === "string" && id !== currentId && knownIds.includes(id),
      ),
    ),
  ];
}
export function toggleFollowing(
  ids: readonly string[],
  targetId: string,
  currentId: string,
  knownIds: readonly string[],
): string[] {
  const clean = normaliseFollowing(ids, currentId, knownIds);
  if (targetId === currentId || !knownIds.includes(targetId)) return clean;
  return clean.includes(targetId)
    ? clean.filter((id) => id !== targetId)
    : [...clean, targetId];
}
export function relationshipCounts(
  bakerId: string,
  relationships: readonly FollowRelationship[],
) {
  const unique = new Map(
    relationships
      .filter((edge) => edge.followerId !== edge.followingId)
      .map((edge) => [`${edge.followerId}:${edge.followingId}`, edge]),
  );
  return {
    followers: [...unique.values()].filter(
      (edge) => edge.followingId === bakerId,
    ).length,
    following: [...unique.values()].filter(
      (edge) => edge.followerId === bakerId,
    ).length,
  };
}

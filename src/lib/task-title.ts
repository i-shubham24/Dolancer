/**
 * A short, readable name for a task or offer.
 *
 * Briefs are written by the supervisor with the headline on the first line, so that
 * line is the name. A task without a brief falls back to its category.
 */
export function taskTitle(item: { brief: string | null; category: string }): string {
  const first = item.brief?.trim().split("\n")[0]?.trim();
  return first || `${item.category} task`;
}

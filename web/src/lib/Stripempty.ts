export function stripEmpty<T extends Record<string, unknown>>(
  input: T,
): Partial<T> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(input)) {
    if (value === "" || value === null || value === undefined) {
      continue;
    }

    if (typeof value === "object" && !Array.isArray(value) && value !== null) {
      const nested = stripEmpty(value as Record<string, unknown>);
      if (Object.keys(nested).length > 0) {
        result[key] = nested;
      }
      continue;
    }

    result[key] = value;
  }

  return result as Partial<T>;
}

// Theme is fixed to the Malawian premium dark theme.
// This hook is retained as a no-op stub for forward compatibility.

export function useTheme() {
  return {
    theme: "dark" as const,
    toggleTheme: () => {},
  };
}

const envUrl = import.meta.env.VITE_API_URL;

export const API_BASE =
  envUrl || (import.meta.env.DEV ? "http://localhost:3001" : "");

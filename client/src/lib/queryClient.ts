import { QueryClient, QueryFunction } from "@tanstack/react-query";

const SUPABASE_URL = "https://itdrjobpqkaoahxcsetl.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0ZHJqb2JwcWthb2FoeGNzZXRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0ODAzMDYsImV4cCI6MjEwMjA1NjMwNn0.Te_gl-kO6cOFT0fj5KJWM5z3xUYutN5o_eH4wtZZ_jI";

async function defaultQueryFn({ queryKey }: { queryKey: readonly unknown[] }) {
  const url = queryKey[0];
  
  if (typeof url === "string" && url.startsWith("/api/")) {
    const endpoint = url.replace("/api/", "");
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}?select=*`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Network response was not ok for ${url}`);
    }

    return res.json();
  }

  throw new Error(`Unsupported query key: ${url}`);
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn as QueryFunction<unknown, readonly unknown[]>,
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
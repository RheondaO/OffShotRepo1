import { QueryClient, QueryFunction } from "@tanstack/react-query";

const SUPABASE_URL = "https://itdrjobpqkaoahxcsetl.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0ZHJqb2JwcWthb2FoeGNzZXRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0ODAzMDYsImV4cCI6MjEwMjA1NjMwNn0.Te_gl-kO6cOFT0fj5KJWM5z3xUYutN5o_eH4wtZZ_jI";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined
): Promise<Response> {
  let targetUrl = url;
  if (url.startsWith("/api/")) {
    const endpoint = url.replace("/api/", "");
    targetUrl = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  }

  const res = await fetch(targetUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      ...(method !== "GET" ? { Prefer: "return=representation" } : {}),
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  await throwIfResNotOk(res);
  return res;
}

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  () =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;

    if (typeof url === "string" && url.startsWith("/api/")) {
      const endpoint = url.replace("/api/", "");
      const separator = endpoint.includes("?") ? "&" : "?";
      const targetUrl = `${SUPABASE_URL}/rest/v1/${endpoint}${separator}select=*`;

      try {
        const res = await fetch(targetUrl, {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        });

        if (!res.ok) {
          console.error(`❌ Supabase REST Error for ${endpoint}:`, await res.text());
          return [] as unknown as T;
        }

        const data = await res.json();
        return data as unknown as T;
      } catch (error) {
        console.error(`❌ Error querying Supabase for ${endpoint}:`, error);
        return [] as unknown as T;
      }
    }

    throw new Error(`Unsupported query key: ${url}`);
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
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
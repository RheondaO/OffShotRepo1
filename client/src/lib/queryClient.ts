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
  data?: unknown | undefined,
): Promise<Response> {
  console.log(`🔍 API Request: ${method} ${url}`, data || '');
  
  try {
    const res = await fetch(url, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });
    
    console.log(`📊 API Response status: ${res.status} for ${method} ${url}`);

    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    console.error(`❌ API Error for ${method} ${url}:`, error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
 ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    console.log(`🔍 Fetching: ${url}`);

    // Direct live query to Supabase REST API for issues
   // Direct live query to Supabase REST API for issues with normalization
    if (typeof url === "string" && url.includes("/api/issues")) {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/issues?select=*&order=id.asc`,
          {
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
          }
        );

        if (!res.ok) {
          console.error("❌ Supabase REST Error:", await res.text());
          return [] as unknown as T;
        }

        const data = await res.json();
        
        // Normalize fields so camelCase and snake_case match component expectations
        const normalizedData = data.map((item: any) => ({
          ...item,
          createdAt: item.createdAt || item.created_at || new Date().toISOString(),
          author: item.author || item.authorName || "Anonymous",
        }));

        console.log("✅ Live Normalized Issues received:", normalizedData);
        return normalizedData as unknown as T;
      } catch (error) {
        console.error("❌ Error querying Supabase directly:", error);
        return [] as unknown as T;
      }
    }

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

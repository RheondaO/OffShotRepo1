import { QueryClient, QueryFunction } from "@tanstack/react-query";

const SUPABASE_URL = "https://itdrjobpqkaoahxcsetl.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0ZHJqb2JwcWthb2FoeGNzZXRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0ODAzMDYsImV4cCI6MjEwMjA1NjMwNn0.Te_gl-kO6cOFT0fj5KJWM5z3xUYutN5o_eH4wtZZ_jI";

function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function convertKeysToCamel(data: any): any {
  if (Array.isArray(data)) {
    return data.map(item => convertKeysToCamel(item));
  } else if (data !== null && typeof data === "object") {
    return Object.keys(data).reduce((acc, key) => {
      const camelKey = toCamelCase(key);
      acc[camelKey] = convertKeysToCamel(data[key]);
      return acc;
    }, {} as Record<string, any>);
  }
  return data;
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
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

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status}: ${text || res.statusText}`);
  }

  return res;
}

async function defaultQueryFn({ queryKey }: { queryKey: readonly unknown[] }) {
  const url = queryKey[0];
  
  if (typeof url === "string" && url.startsWith("/api/")) {
    const endpoint = url.replace("/api/", "");
    const separator = endpoint.includes("?") ? "&" : "?";
    const targetUrl = `${SUPABASE_URL}/rest/v1/${endpoint}${separator}select=*`;

    const res = await fetch(targetUrl, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`Supabase fetch failed for ${url}:`, errText);
      throw new Error(`Network response was not ok for ${url}: ${errText}`);
    }

    const json = await res.json();
    return convertKeysToCamel(json);
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
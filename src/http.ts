import { MailoflyError } from "./error.js";

export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export async function mailoflyRequest<T>(options: {
  baseUrl: string;
  path: string;
  method?: HttpMethod;
  apiKey?: string;
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
}): Promise<T> {
  const base = options.baseUrl.replace(/\/$/, "");
  let path = options.path.startsWith("/") ? options.path : `/${options.path}`;
  if (options.query) {
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(options.query)) {
      if (v === undefined) continue;
      q.set(k, String(v));
    }
    const s = q.toString();
    if (s) path += (path.includes("?") ? "&" : "?") + s;
  }
  const url = `${base}${path}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
    "X-Mailofly-Client": "sdk/js",
  };
  if (options.apiKey) headers.Authorization = `Bearer ${options.apiKey}`;
  if (options.body !== undefined) headers["Content-Type"] = "application/json";

  const res = await fetch(url, {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const text = await res.text();
  let parsed: unknown;
  try {
    parsed = text ? (JSON.parse(text) as unknown) : undefined;
  } catch {
    parsed = text;
  }

  if (!res.ok) {
    const o = parsed as Record<string, unknown> | undefined;
    const err = typeof o?.error === "string" ? o.error : res.statusText;
    const msg = typeof o?.message === "string" ? o.message : typeof parsed === "string" ? parsed : undefined;
    throw new MailoflyError(res.status, err, msg, parsed);
  }

  return parsed as T;
}

import { mailoflyRequest } from "./http.js";
import type {
  ComposeSendParams,
  ComposeSendResult,
  EmailsSendParams,
  EmailsSendResult,
  EmailsBatchSendResult,
  EmailsListQuery,
  EmailsListResult,
  ResendEmailDetail,
  ItemResponse,
  ListResponse,
  MailoflyAccount,
  MailoflyCampaign,
  MailoflyContact,
  MailoflyDiscovery,
  MailoflySegment,
  MailoflyTemplate,
  MailLogsPage,
} from "./types.js";

const DEFAULT_BASE_URL = "https://www.mailofly.com";
const API_PREFIX = "/api/v1";

export type MailoflyOptions = {
  /** Mailofly API key (`mf_live_…`). */
  apiKey: string;
  /**
   * Origin only, no trailing slash (e.g. `https://www.mailofly.com`).
   * Paths `/api/v1/...` are appended automatically.
   */
  baseUrl?: string;
};

function apiPath(suffix: string): string {
  const s = suffix.startsWith("/") ? suffix : `/${suffix}`;
  return `${API_PREFIX}${s}`;
}

export class Mailofly {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(options: MailoflyOptions) {
    if (!options?.apiKey?.trim()) {
      throw new Error("Mailofly: apiKey is required");
    }
    this.apiKey = options.apiKey.trim();
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");
  }

  /** Unauthenticated discovery (`GET /api/v1`). */
  static async discovery(opts?: { baseUrl?: string }): Promise<MailoflyDiscovery> {
    const baseUrl = (opts?.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");
    return mailoflyRequest<MailoflyDiscovery>({ baseUrl, path: API_PREFIX, method: "GET" });
  }

  private req<T>(path: string, init?: { method?: "GET" | "POST" | "PATCH" | "DELETE"; body?: unknown; query?: Record<string, string | number | boolean | undefined> }): Promise<T> {
    return mailoflyRequest<T>({
      baseUrl: this.baseUrl,
      path: apiPath(path),
      method: init?.method ?? "GET",
      apiKey: this.apiKey,
      body: init?.body,
      query: init?.query,
    });
  }

  readonly accounts = {
    list: (): Promise<ListResponse<MailoflyAccount>> => this.req("/accounts"),
    create: (body: Record<string, unknown>): Promise<ItemResponse<MailoflyAccount>> =>
      this.req("/accounts", { method: "POST", body }),
    get: (id: string): Promise<ItemResponse<MailoflyAccount>> => this.req(`/accounts/${encodeURIComponent(id)}`),
    update: (id: string, body: Record<string, unknown>): Promise<ItemResponse<MailoflyAccount>> =>
      this.req(`/accounts/${encodeURIComponent(id)}`, { method: "PATCH", body }),
    delete: (id: string): Promise<{ ok: boolean }> => this.req(`/accounts/${encodeURIComponent(id)}`, { method: "DELETE" }),
  };

  /** Alias for `accounts`. Supports both `/identities` and `/accounts`. */
  readonly identities = this.accounts;

  readonly contacts = {
    list: (query?: { segment_id?: string }): Promise<ListResponse<MailoflyContact>> =>
      this.req("/contacts", {
        query: query?.segment_id ? { segment_id: query.segment_id } : undefined,
      }),
    create: (body: Record<string, unknown>): Promise<ItemResponse<MailoflyContact>> =>
      this.req("/contacts", { method: "POST", body }),
    get: (id: string): Promise<ItemResponse<MailoflyContact>> => this.req(`/contacts/${encodeURIComponent(id)}`),
    update: (id: string, body: Record<string, unknown>): Promise<ItemResponse<MailoflyContact>> =>
      this.req(`/contacts/${encodeURIComponent(id)}`, { method: "PATCH", body }),
    delete: (id: string): Promise<{ ok: boolean }> => this.req(`/contacts/${encodeURIComponent(id)}`, { method: "DELETE" }),
  };

  readonly templates = {
    list: (): Promise<ListResponse<MailoflyTemplate>> => this.req("/templates"),
    create: (body: Record<string, unknown>): Promise<ItemResponse<MailoflyTemplate>> =>
      this.req("/templates", { method: "POST", body }),
    get: (id: string): Promise<ItemResponse<MailoflyTemplate>> => this.req(`/templates/${encodeURIComponent(id)}`),
    update: (id: string, body: Record<string, unknown>): Promise<ItemResponse<MailoflyTemplate>> =>
      this.req(`/templates/${encodeURIComponent(id)}`, { method: "PATCH", body }),
    delete: (id: string): Promise<{ ok: boolean }> => this.req(`/templates/${encodeURIComponent(id)}`, { method: "DELETE" }),
  };

  readonly segments = {
    list: (): Promise<ListResponse<MailoflySegment>> => this.req("/segments"),
    create: (body: { name: string }): Promise<ItemResponse<MailoflySegment>> =>
      this.req("/segments", { method: "POST", body }),
    get: (id: string): Promise<ItemResponse<MailoflySegment>> => this.req(`/segments/${encodeURIComponent(id)}`),
    update: (id: string, body: Record<string, unknown>): Promise<ItemResponse<MailoflySegment>> =>
      this.req(`/segments/${encodeURIComponent(id)}`, { method: "PATCH", body }),
    delete: (id: string): Promise<{ ok: boolean }> => this.req(`/segments/${encodeURIComponent(id)}`, { method: "DELETE" }),
    contacts: {
      list: (segmentId: string): Promise<ListResponse<MailoflyContact>> =>
        this.req(`/segments/${encodeURIComponent(segmentId)}/contacts`),
      add: (
        segmentId: string,
        body: { contact_id: string } | { email: string; first_name?: string; last_name?: string; phone?: string; name?: string }
      ): Promise<ItemResponse<{ contact_id: string; already_linked?: boolean }>> =>
        this.req(`/segments/${encodeURIComponent(segmentId)}/contacts`, { method: "POST", body }),
      remove: (segmentId: string, contactId: string): Promise<{ ok: boolean }> =>
        this.req(`/segments/${encodeURIComponent(segmentId)}/contacts/${encodeURIComponent(contactId)}`, {
          method: "DELETE",
        }),
    },
  };

  readonly campaigns = {
    list: (): Promise<ListResponse<MailoflyCampaign>> => this.req("/campaigns"),
    create: (body: Record<string, unknown>): Promise<ItemResponse<MailoflyCampaign>> =>
      this.req("/campaigns", { method: "POST", body }),
    get: (id: string): Promise<ItemResponse<MailoflyCampaign>> => this.req(`/campaigns/${encodeURIComponent(id)}`),
    update: (id: string, body: Record<string, unknown>): Promise<ItemResponse<MailoflyCampaign>> =>
      this.req(`/campaigns/${encodeURIComponent(id)}`, { method: "PATCH", body }),
    delete: (id: string): Promise<{ ok: boolean }> => this.req(`/campaigns/${encodeURIComponent(id)}`, { method: "DELETE" }),
    runs: (id: string): Promise<ListResponse<Record<string, unknown>>> =>
      this.req(`/campaigns/${encodeURIComponent(id)}/runs`),
    send: (
      id: string,
      body?: { send_now?: boolean; sendNow?: boolean; sender_account_ids?: string[]; senderAccountIds?: string[] }
    ): Promise<{
      ok: true;
      campaign_id: string;
      contacts_messaged: number;
      assigned: unknown;
      send_now: boolean;
    }> => this.req(`/campaigns/${encodeURIComponent(id)}/send`, { method: "POST", body: body ?? { send_now: true } }),
  };

  readonly emails = {
    list: (query?: EmailsListQuery): Promise<EmailsListResult> => {
      const q: Record<string, string | number | boolean> = {};
      if (query?.limit != null) q.limit = query.limit;
      if (query?.after) q.after = query.after;
      if (query?.before) q.before = query.before;
      return this.req<EmailsListResult>("/emails", { query: Object.keys(q).length ? q : undefined });
    },
    get: (id: string): Promise<ResendEmailDetail> =>
      this.req<ResendEmailDetail>(`/emails/${encodeURIComponent(id)}`),
    send: (params: EmailsSendParams): Promise<EmailsSendResult> =>
      this.req<EmailsSendResult>("/emails", { method: "POST", body: params }),
    update: (id: string, body: { scheduled_at?: string | null; scheduledAt?: string | null }): Promise<ResendEmailDetail> =>
      this.req<ResendEmailDetail>(`/emails/${encodeURIComponent(id)}`, { method: "PATCH", body }),
    cancel: (id: string): Promise<ResendEmailDetail> =>
      this.req<ResendEmailDetail>(`/emails/${encodeURIComponent(id)}/cancel`, { method: "POST" }),
  };

  /** Resend-compatible batch send (POST /emails/batch). */
  readonly batch = {
    send: (emails: EmailsSendParams[]): Promise<EmailsBatchSendResult> =>
      this.req<EmailsBatchSendResult>("/emails/batch", { method: "POST", body: emails }),
  };

  /** @deprecated Use `emails.send` instead. */
  readonly compose = {
    send: (params: ComposeSendParams): Promise<ComposeSendResult> =>
      this.req<ComposeSendResult>("/emails", { method: "POST", body: params }),
  };

  readonly mailLogs = {
    list: (query?: {
      page?: number;
      page_size?: number;
      campaign_id?: string;
      account_id?: string;
      campaign_run_id?: string;
      status?: "pending" | "sending" | "sent" | "failed" | "deferred" | "halted" | "cancelled";
    }): Promise<MailLogsPage> => {
      const q: Record<string, string | number | boolean> = {};
      if (query?.page != null) q.page = query.page;
      if (query?.page_size != null) q.page_size = query.page_size;
      if (query?.campaign_id) q.campaign_id = query.campaign_id;
      if (query?.account_id) q.account_id = query.account_id;
      if (query?.campaign_run_id) q.campaign_run_id = query.campaign_run_id;
      if (query?.status) q.status = query.status;
      return this.req("/mail-logs", { query: Object.keys(q).length ? q : undefined });
    },
  };
}

/** Response from unauthenticated `GET /api/v1` (discovery). */
export type MailoflyDiscovery = {
  name: string;
  version: string;
  auth?: string;
  base_path?: string;
  resources?: Record<string, string | string[]>;
};

export type MailoflyAccount = {
  id: string;
  user_id: string;
  name: string;
  provider_type: "smtp" | "google";
  smtp_host: string | null;
  smtp_port: number | null;
  smtp_username: string | null;
  google_email: string | null;
  daily_mail_limit: number | null;
  daily_mail_used: number | null;
  daily_mail_used_date: string | null;
  created_at: string;
  updated_at: string;
  account_key?: string;
};

export type MailoflyContact = Record<string, unknown>;

export type MailoflyTemplate = Record<string, unknown>;

export type MailoflySegment = Record<string, unknown>;

export type MailoflyCampaign = Record<string, unknown>;

export type MailoflyMailLog = Record<string, unknown>;

export type ListResponse<T> = { data: T[] };

export type ItemResponse<T> = { data: T };

export type MailLogsPage = {
  data: MailoflyMailLog[];
  page: number;
  page_size: number;
  total: number;
};

export type ComposeSendResult = {
  ok: true;
  sent: number;
  failed: { email: string; error: string }[];
};

export type ComposeRecipients =
  | { emails: string | string[]; type?: string }
  | { type: "contacts"; contact_ids: string[] };

export type ComposeSendParams = {
  account_key: string;
  /** Use a saved template (mutually exclusive with subject/body). */
  template_id?: string;
  /** Inline subject (requires body when template_id is omitted). */
  subject?: string;
  /** HTML body (requires subject when template_id is omitted). */
  body?: string;
  recipients: ComposeRecipients;
  variables?: Record<string, string>;
};

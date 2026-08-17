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

export type EmailsSendResult = {
  id: string;
};

export type EmailsBatchSendResult = {
  data: { id: string }[];
};

export type ResendEmailListItem = {
  object: "email";
  id: string;
  message_id: string | null;
  to: string[];
  from: string | null;
  created_at: string;
  subject: string;
  bcc: string[] | null;
  cc: string[] | null;
  reply_to: string[] | null;
  last_event: string;
  scheduled_at: string | null;
};

export type ResendEmailDetail = ResendEmailListItem & {
  html: string | null;
  text: string | null;
  tags: { name: string; value: string }[];
};

export type EmailsListResult = {
  object: "list";
  has_more: boolean;
  data: ResendEmailListItem[];
};

export type EmailsListQuery = {
  limit?: number;
  after?: string;
  before?: string;
};

export type EmailsSendParams = {
  /** Optional public account key (acc_…). When omitted, any eligible account is auto-selected. */
  account_key?: string;
  accountKey?: string;
  /** Sender email. Supports `Name <email@example.com>`. */
  from: string;
  to: string | string[];
  subject?: string;
  html?: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
  reply_to?: string | string[];
  replyTo?: string | string[];
  headers?: Record<string, string>;
  tags?: { name: string; value: string }[];
  attachments?: {
    filename: string;
    content?: string;
    path?: string;
    content_type?: string;
    content_id?: string;
  }[];
  template?: {
    id: string;
    variables?: Record<string, string | number>;
  };
  template_id?: string;
  variables?: Record<string, string | number>;
  /** ISO 8601. When in the future, the email is queued instead of sent immediately. */
  scheduled_at?: string;
  scheduledAt?: string;
};

export type ComposeSendResult = EmailsSendResult;

export type ComposeRecipients =
  | { emails: string | string[]; type?: string }
  | { type: "contacts"; contact_ids: string[] };

/** @deprecated Use EmailsSendParams instead. */
export type ComposeSendParams = {
  account_key?: string;
  template_id?: string;
  subject?: string;
  body?: string;
  recipients: ComposeRecipients;
  variables?: Record<string, string>;
};

export interface EmailPayload {
  to: string;
  subject: string;
  html: string | React.ReactNode | Promise<React.ReactNode>;
}

export interface EmailService {
  sendEmail(payload: EmailPayload): Promise<void>;
}

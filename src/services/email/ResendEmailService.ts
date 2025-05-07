import { Resend } from 'resend';
import { EmailPayload, EmailService } from './EmailService';

export class ResendEmailService implements EmailService {
  private resend: Resend;
  private sender: string;

  constructor(apiKey: string, sender: string) {
    this.resend = new Resend(apiKey);
    this.sender = sender;
  }

  async sendEmail(payload: EmailPayload): Promise<void> {
    await this.resend.emails.send({
      from: this.sender,
      to: payload.to,
      subject: payload.subject,
      react: await payload.html,
    });
  }
}

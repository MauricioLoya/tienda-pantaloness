import { prisma } from '@/lib/prima/client';
import { EmailService } from '@/services/email/EmailService';
import bcrypt from 'bcrypt';
import { generateRandomPassword } from '@/lib/utils';

interface IPasswordResetService {
  resetPassword(email: string): Promise<boolean>;
}

export class PasswordResetService implements IPasswordResetService {
  private emailService: EmailService;
  private sender: string;

  constructor(emailService: EmailService, sender: string) {
    this.emailService = emailService;
    this.sender = sender;
  }

  async resetPasswordAdmin(userId: number, password: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
      });

      if (!user) {
        return false;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      await this.emailService.sendEmail({
        to: user.email,
        subject: 'Tu nueva contraseña',
        html: `
          <h1>Nueva contraseña para tu cuenta</h1>
          <p>Hemos generado una nueva contraseña para tu cuenta:</p>
          <p><strong>${password}</strong></p>
          <p>Te recomendamos cambiar esta contraseña en cuanto inicies sesión.</p>
          <p>Si no has solicitado este cambio, por favor contacta al administrador.</p>
        `,
      });
      return true;
    } catch (error) {
      console.error('Error resetting password:', error);
      return false;
    }
  }

  async resetPassword(email: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return false;
      }

      const newPassword = generateRandomPassword();

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      await this.emailService.sendEmail({
        to: email,
        subject: 'Tu nueva contraseña',
        html: `
          <h1>Nueva contraseña para tu cuenta</h1>
          <p>Hemos generado una nueva contraseña para tu cuenta:</p>
          <p><strong>${newPassword}</strong></p>
          <p>Te recomendamos cambiar esta contraseña en cuanto inicies sesión.</p>
          <p>Si no has solicitado este cambio, por favor contacta al administrador.</p>
        `,
      });

      return true;
    } catch (error) {
      console.error('Error resetting password:', error);
      return false;
    }
  }
}

import * as crypto from 'crypto';

export class AuthUtils {
  static generateResetPasswordToken(): string {
    return crypto.randomBytes(20).toString('hex');
  }

  static extractUsernameFromEmail(email: string): string {
    const parts: string[] = email.split('@');

    const username: string = parts[0];

    return username;
  }
}

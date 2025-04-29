import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordResponse {
  @ApiProperty({
    example: 'Reset token generated successfully',
    description: 'Status message',
  })
  message: string;

  @ApiProperty({
    example: 'dGhpc2lzYXJlc2V0dG9rZW4=',
    description: 'Reset password token',
  })
  token: string;
}

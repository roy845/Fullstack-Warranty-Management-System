import { ApiProperty } from '@nestjs/swagger';

export class BioResponse {
  @ApiProperty({
    example: 'Welcome to my profile!',
    description: 'User welcome message',
  })
  welcomeMessage: string;

  @ApiProperty({
    example:
      'https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg',
    description: 'User avatar URL',
  })
  avatar: string;

  constructor(welcomeMessage: string, avatar: string) {
    this.welcomeMessage = welcomeMessage;
    this.avatar = avatar;
  }
}

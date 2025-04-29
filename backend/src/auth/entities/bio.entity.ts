import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class Bio {
  @Prop({ default: 'Welcome to my profile!' })
  welcomeMessage: string;

  @Prop({
    default:
      'https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg',
  })
  avatar: string;
}

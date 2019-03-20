import {Type} from 'class-transformer';
import {Token} from './token';

export class User {
  username: string;
  isPermanent: boolean;

  @Type(() => Token)
  currentToken: Token;
}

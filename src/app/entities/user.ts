import {Type} from 'class-transformer';
import {Token} from './token';

export class User {
  username: string;
  isPermanent: boolean;
  roles: string[];

  @Type(() => Token)
  currentToken: Token;
}

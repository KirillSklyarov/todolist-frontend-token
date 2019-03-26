import {Type} from 'class-transformer';
import {Token} from './token';

export class User {
  username: string;
  permanent: boolean;

  @Type(() => Token)
  currentToken: Token;
}

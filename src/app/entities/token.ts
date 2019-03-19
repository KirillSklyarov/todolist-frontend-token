import {User} from './user';
import {Transform, Type} from 'class-transformer';
import {DateTime} from 'luxon';

export class Token {
  alias: string;

  // @Type(() => DateTime)
  // @Transform((value: DateTime) => value.toISO(), { toPlainOnly: true })
  // @Transform((value: string) => DateTime.fromISO(value).setZone('UTC'), { toClassOnly: true })
  // createdAt: DateTime;
  //
  // @Type(() => DateTime)
  // @Transform((value: DateTime) => value.toISO(), { toPlainOnly: true })
  // @Transform((value: string) => DateTime.fromISO(value).setZone('UTC'), { toClassOnly: true })
  // lastEnterAt: DateTime;

  public getAlias(): string {
    return this.alias;
  }
}

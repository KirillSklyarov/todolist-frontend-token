import {Item} from './item';
import {Type} from 'class-transformer';

export class CreateData {
  @Type(() => Item)
  item: Item;
  count: number;
}

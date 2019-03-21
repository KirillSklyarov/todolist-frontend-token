import {Item} from './item';
import {Type} from 'class-transformer';

export class ItemsData {
  @Type(() => Item)
  items: Item[];
  count: number;
}

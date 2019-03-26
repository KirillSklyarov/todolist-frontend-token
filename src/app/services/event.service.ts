import {EventEmitter, Injectable} from '@angular/core';
import {State} from '../entities/state';
import {User} from '../entities/user';
import {Item} from '../entities/item';
@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly stateEvent: EventEmitter<State> = new EventEmitter<State>();
  private readonly userEvent: EventEmitter<User|null> = new EventEmitter<User|null>();
  private readonly createEvent: EventEmitter<Item> = new EventEmitter<Item>();
  private readonly deleteEvent: EventEmitter<Item> = new EventEmitter();
  constructor() { }

  public emitState(state: State): void {
    this.stateEvent.emit(state);
  }

  public subscribeState(callback: (state: State) => void) {
    this.stateEvent.subscribe(callback);
  }

  public emitUser(user: User|null): void {
    this.userEvent.emit(user);
  }

  public subscribeUser(callback: (user: User|null) => void) {
    this.userEvent.subscribe(callback);
  }

  public emitCreate(item: Item): void {
    this.createEvent.emit(item);
  }

  public subscribeCreate(callback: (item: Item) => void) {
    this.createEvent.subscribe(callback);
  }

  public emitDelete(item: Item): void {
    this.createEvent.emit(item);
  }

  public subscribeDelete(callback: (item: Item) => void) {
    this.createEvent.subscribe(callback);
  }
}

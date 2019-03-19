import {Component, OnDestroy, OnInit} from '@angular/core';

import {InitService} from './services/init.service';
import {State} from './entities/state';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription = new Subscription();
  public state: State = State.false;
  title = 'frontend-token';

  constructor(private initService: InitService) {

  }

  public ngOnInit(): void {
    const initSubscription = this.initService.getStateEvent()
      .subscribe((state: State) => {
        console.log(state);
        this.state = state;
      });
    this.subscriptions.add(initSubscription);
    this.initService.init();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

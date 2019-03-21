import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';

import {UserService} from './services/user.service';
import {State} from './entities/state';
import {Subscription} from 'rxjs';
import {User} from './entities/user';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {RegisterComponent} from './components/register/register.component';
import {LoginComponent} from './components/login/login.component';
import {LogoutComponent} from './components/logout/logout.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly subscriptions: Subscription = new Subscription();
  public state: State = State.false;
  public user: User = null;
  public State;
  @ViewChild('panel') public panel: ElementRef;
  @ViewChild('tabsetWrapper') public tabsetWrapper: ElementRef;

  constructor(private userService: UserService,
              private modalService: NgbModal) {
    this.State = State;
  }

  public ngOnInit(): void {
    const initSubscription = this.userService.getStateEvent()
      .subscribe((state: State) => {
        this.state = state;
      });
    const userSubscription = this.userService.getUserEvent()
      .subscribe((user: User|null) => {
        this.user = user;
      });

    this.subscriptions.add(initSubscription);
    this.subscriptions.add(userSubscription);
    this.userService.init();
  }

  public ngAfterViewInit(): void {
    const ulTablist = this.tabsetWrapper.nativeElement.firstChild.firstChild;
    ulTablist.appendChild(this.panel.nativeElement);
    this.panel.nativeElement.classList.remove('hidden');
  }

  public openRegister(): void {
    this.modalService.open(RegisterComponent);
  }

  public openLogin(): void {
    this.modalService.open(LoginComponent);
  }

  public openLogout(): void {
    this.modalService.open(LogoutComponent);
  }

  public reinit(): void {
    this.userService.init();
  }
  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UserService} from '../../services/user.service';
import {ApiResponse} from '../../entities/apiResponse';
import {Type} from '../../entities/alert';
import {ConfirmComponent} from '../modal/confirm.component';
import {plainToClassFromExist} from 'class-transformer';
import {User} from '../../entities/user';
import {EventService} from '../../services/event.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent extends ConfirmComponent implements OnInit, OnDestroy {
  @Input() public user: User | null;
  public isLogoutError: boolean = false;

  constructor(activeModal: NgbActiveModal,
              private userService: UserService) {
    super(activeModal);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    // const userSubscription = this.eventService
    //   .subscribeUser((user: User | null) => {
    //     this.user = user;
    //   });

    // this.subscriptions.add(userSubscription);
    this.mainAlert.type = Type.danger;
  }

  public yes(): void {
    super.yes();

    this.processing = true;
    const subscription = this.userService.logout()
      .subscribe((apiResponse: ApiResponse<User>) => {
        const response = plainToClassFromExist(new ApiResponse<User>(User), apiResponse);
        this.processing = false;
        if (response.success) {
          this.activeModal.close();
        } else {
        }
      }, response => {
        this.processing = false;
        if (response.status === 401) {
          this.userService.reinit();
          this.activeModal.close();
          return;
        }
      });

    this.subscriptions.add(subscription);
    this.isLogoutError = false;
  }

  public no(): void {
    this.isLogoutError = false;
    super.no();
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}

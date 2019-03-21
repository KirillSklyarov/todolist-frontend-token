import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UserService} from '../../services/user.service';
import {ApiResponse} from '../../entities/apiResponse';
import {Type} from '../../entities/alert';
import {ConfirmComponent} from '../modal/confirm.component';
import {plainToClassFromExist} from 'class-transformer';
import {User} from '../../entities/user';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent extends ConfirmComponent implements OnInit, OnDestroy {
  public isLogoutError: boolean = false;

  constructor(activeModal: NgbActiveModal,
              private userService: UserService) {
    super(activeModal);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.mainAlert.type = Type.danger;
  }

  public yes(): void {
    super.yes();
    if (this.isLogoutError) {
      this.userService.reinit();
      this.activeModal.close();
    } else {
      this.processing = true;
      const subscription = this.userService.logout()
        .subscribe((apiResponse: ApiResponse<User>) => {
          const response = plainToClassFromExist(new ApiResponse<User>(User), apiResponse);
          this.processing = false;
          if (response.success) {
            this.activeModal.close();
          } else {
            this.setError();
          }
        }, response => {
          this.processing = false;
          if (response.status === 401) {
            this.userService.reinit();
            this.activeModal.close();
            return;
          }

          this.setError();
        });

      this.subscriptions.add(subscription);
    }
    this.isLogoutError = false;
  }

  public no(): void {
    this.isLogoutError = false;
    super.no();
  }

  private setError(): void {
    this.isLogoutError = true;
    this.mainAlert.message = 'Server error. Clear data only in browser?';
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}

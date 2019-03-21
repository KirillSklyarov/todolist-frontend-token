import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../services/user.service';
import {ApiResponse} from '../../entities/apiResponse';
import {Token} from '../../entities/token';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Alert, Type} from '../../entities/alert';
import {UserComponent} from '../user/user.component';
import {messages} from '../../messages';
import {plainToClassFromExist} from 'class-transformer';
import {User} from '../../entities/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends UserComponent implements OnInit, OnDestroy {
  @ViewChild('button') public button: ElementRef;

  constructor(activeModal: NgbActiveModal,
              userService: UserService) {
    super(activeModal, userService);
  }

  public ngOnInit(): void {
    super.ngOnInit();
  }

  public login(): void {
    if (!this.processing) {
      this.processing = true;
      this.alerts = [];
      const subscription = this.userService.login(this.username, this.password)
        .subscribe((apiResponse: ApiResponse<User>) => {
          const response = plainToClassFromExist(new ApiResponse<User>(User), apiResponse);
          this.processing = false;
          if (response.success) {
            this.activeModal.close();
          } else {
            this.alerts.push(new Alert(Type.danger, response.message));
          }
        }, (response) => {
          this.processing = false;
          let message: string;
          if (response.status > 0) {
            if (response.error && response.error.message) {
              message = response.error.message;
            } else {
              switch (response.status) {
                case 400:
                  message = messages.errors.input;
                  break;
                case 401:
                  message = messages.errors.auth;
                  break;
                default:
                  message = messages.errors.server;
                  break;
              }
            }
          } else {
            message = messages.errors.connection;
          }
          this.alerts.push(new Alert(Type.danger, message));
        });

      this.subscriptions.add(subscription);
    }
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}

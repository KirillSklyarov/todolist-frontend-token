import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Item} from '../../entities/item';
import {ConfirmComponent} from '../modal/confirm.component';
import {ItemService} from '../../services/item.service';
import {Alert, Type} from '../../entities/alert';
import {ApiResponse} from '../../entities/apiResponse';
import {plainToClassFromExist} from 'class-transformer';
import {messages} from '../../messages';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent extends ConfirmComponent implements OnInit, OnDestroy {
  @Input() public item: Item;
  public requiredInit: boolean = false;

  constructor(activeModal: NgbActiveModal,
              private itemService: ItemService,
              private userService: UserService) {
    super(activeModal);
  }

  public ngOnInit(): void {
    super.ngOnInit();
  }

  public yes(): void {
    super.yes();
    this.processing = true;
    const subscription = this.itemService.delete(this.item).subscribe(
      (apiResponse: ApiResponse<null>) => {
        const response = plainToClassFromExist(new ApiResponse<null>(null), apiResponse);
        this.processing = false;
        // TODO implement handling errors
        if (response.success) {
          this.activeModal.close();
        } else {
          this.processing = false;
          this.alerts.push(new Alert(Type.danger, 'Error'));

        }

      }, (response) => {
        let message: string;
        this.processing = false;
        if (response.status > 0) {
          if (response.error && response.error.message) {
            message = response.error.message;
          } else {
            switch (response.status) {
              case 400:
                message = messages.errors.input;
                break;
              case 401:
                message = messages.errors.token;
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
        if (response.status === 401) {
          this.requiredInit = true;
          this.alerts.push(new Alert(Type.danger, 'Reinitialization is required'));
        }
      }
    );

    this.subscriptions.add(subscription);
  }

  public reinit(): void {
    this.requiredInit = false;
    this.userService.reinit();
    this.activeModal.close();
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}

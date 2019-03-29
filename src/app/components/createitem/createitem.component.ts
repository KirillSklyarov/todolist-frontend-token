import {Component, OnInit, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ItemService} from '../../services/item.service';
import {Item} from '../../entities/item';
import {ApiResponse} from '../../entities/apiResponse';
import {CreateData} from '../../entities/createData';
import {ModalComponent} from '../modal/modal.component';
import {Alert, Type} from '../../entities/alert';
import {messages} from '../../messages';
import {UserService} from '../../services/user.service';
import {plainToClassFromExist} from 'class-transformer';

@Component({
  selector: 'app-createitem',
  templateUrl: './createitem.component.html',
  styleUrls: ['./createitem.component.css']
})
export class CreateitemComponent extends ModalComponent implements OnInit {
  @Input() public date: string;
  public title: string;
  public description: string;
  public requiredInit: boolean = false;

  constructor(activeModal: NgbActiveModal,
              private itemService: ItemService,
              private userService: UserService) {
    super(activeModal);
  }

  public ngOnInit(): void {
    super.ngOnInit();
  }

  public create() {
    if (!this.processing) {
      this.processing = true;
      this.alerts = [];

      const item = new Item();
      item.title = this.title;
      item.description = this.description;
      item.date = this.date;

      const subscription = this.itemService.create(item).subscribe(
        (apiResponse: ApiResponse<CreateData>) => {
          const response = plainToClassFromExist(new ApiResponse<CreateData>(CreateData), apiResponse);
          this.processing = false;
          if (response.success) {
            this.activeModal.close();
          } else {
            this.alerts.push(new Alert(Type.danger, response.message));
          }

        }, response => {
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
  }

  public reinit(): void {
    console.log('reinit');
    this.requiredInit = false;
    this.userService.reinit();
    this.activeModal.close();
  }

  public onDescriptionEnter(event: KeyboardEvent) {
    if (event.key === 'Enter' && event.ctrlKey) {
      this.create();
    }
  }
}

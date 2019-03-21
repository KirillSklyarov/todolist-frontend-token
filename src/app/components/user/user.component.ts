import {OnInit} from '@angular/core';
import {ModalComponent} from '../modal/modal.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UserService} from '../../services/user.service';

export class UserComponent extends ModalComponent implements OnInit {
  public username: string = '';
  public password: string = '';
  public isShow: boolean = false;

  constructor(activeModal: NgbActiveModal,
              protected userService: UserService) {
    super(activeModal);
  }

  public ngOnInit(): void {
    super.ngOnInit();
  }

  public toggleShow() {
    this.isShow = !this.isShow;
  }
}

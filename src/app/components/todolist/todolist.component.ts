import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {environment} from '../../../environments/environment';
import {ItemsData} from '../../entities/itemsData';
import {ItemService} from '../../services/item.service';
import {Item} from '../../entities/item';
import {NgbDate, NgbDatepicker, NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreateitemComponent} from '../createitem/createitem.component';
import {DeleteComponent} from '../delete/delete.component';
import {TodolistState} from '../../entities/todolistState';
import {UserService} from '../../services/user.service';
import {plainToClassFromExist} from 'class-transformer';
import {DateTime} from 'luxon';
import {ApiResponse} from '../../entities/apiResponse';
import {EventService} from '../../services/event.service';
import {User} from '../../entities/user';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.css']
})
export class TodolistComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription = new Subscription();

  @ViewChild('dp') public dp: NgbDatepicker;
  private countPerPage: number = 10;
  private count: number = 0;

  public date = DateTime.local();
  public page: number = 1;
  public items: Item[] = [];
  public active: Item = null;
  public TodolistState;
  public state: TodolistState = TodolistState.processing;
  ngbDate: NgbDateStruct;

  constructor(private itemService: ItemService,
              private modalService: NgbModal,
              private userService: UserService,
              private eventService: EventService) {
    this.TodolistState = TodolistState;

  }

  public ngOnInit(): void {
    this.state = TodolistState.processing;
    this.ngbDate = {
      day: this.date.day,
      month: this.date.month,
      year: this.date.year,
    };

    this.countPerPage = environment.defaultCountPerPage;
    const createSubscription = this.eventService
      .subscribeCreate((item: Item) => {
        this.loadItems();
      });

    const userSubscription = this.eventService
      .subscribeUser((user: User | null) => {
        this.loadItems();
      });

    // TODO: refactor delete
    const deleteSubscription = this.eventService
      .subscribeDelete((item: Item) => {
        this.loadItems();
      });
    this.subscriptions.add(createSubscription);
    this.subscriptions.add(userSubscription);
    this.subscriptions.add(deleteSubscription);
    this.loadItems();
  }

  public loadItems() {
    this.state = TodolistState.processing;
    this.active = null;
    const listSubscription = this.itemService.getList(this.date, this.page, this.countPerPage)
      .subscribe((apiResponse: ApiResponse<ItemsData>) => {
        const response = plainToClassFromExist(new ApiResponse<ItemsData>(ItemsData), apiResponse);
        if (response.success) {
          this.state = TodolistState.success;
          this.count = response.data.count;
          this.items = response.data.items;
        } else {
          this.state = TodolistState.serverError;
        }
      }, response => {
        if (response.status === 401) {
          this.state = TodolistState.authError;
        } else {
          this.state = TodolistState.serverError;
        }
      });

    this.subscriptions.add(listSubscription);
  }

  public reinit(): void {
    this.userService.reinit();
  }

  public toPage(page): void {
    this.page = page;
    this.loadItems();
  }

  public stepDate(days: number): void {
    this.date = this.date.plus({days});
    this.page = 1;
    this.navigate();
    this.loadItems();
  }

  public today() {
    this.date = DateTime.local();
    this.navigate();
    this.loadItems();
  }

  private navigate(): void {
    this.ngbDate = {
      day: this.date.day,
      month: this.date.month,
      year: this.date.year,
    };

    this.dp.navigateTo({
      day: this.date.day,
      month: this.date.month,
      year: this.date.year,
    });
  }

  public selectDate(date: NgbDate): void {
    this.date = DateTime.local(date.year, date.month, date.day);
    this.page = 1;
    this.loadItems();
  }

  public openCreate(): void {
    const modalRef = this.modalService.open(CreateitemComponent);
    modalRef.componentInstance.date = this.date.toISODate();
  }

  public selectItem(item: Item): void {
    this.active = item;
  }

  public openDelete(item: Item): void {
    const modalRef = this.modalService.open(DeleteComponent);
    modalRef.componentInstance.item = item;
  }

  public getLastPage(): number {
    return Math.ceil(this.count / this.countPerPage);
  }

  public resetActive() {
    this.active = null;
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

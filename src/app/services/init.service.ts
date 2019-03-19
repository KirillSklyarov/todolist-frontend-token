import {EventEmitter, Injectable} from '@angular/core';
import {State} from '../entities/state';
import {HttpClient} from '@angular/common/http';
import {ApiResponse} from '../entities/apiResponse';
import {plainToClassFromExist} from 'class-transformer';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  private static readonly createUserUri = environment.apiServer + 'api/v1/user/init';
  private readonly stateEvent: EventEmitter<State> = new EventEmitter<State>();

  constructor(private httpClient: HttpClient) {
  }

  public init(): void {
    this.stateEvent.emit(State.processing);
    this.httpClient
      .post<ApiResponse<null>>(InitService.createUserUri, null)
      .subscribe((apiResponse: ApiResponse<null>) => {
        const response = plainToClassFromExist(new ApiResponse<null>(null), apiResponse);
        console.log(response);
        if (response.success) {
          this.stateEvent.emit(State.true);
        } else {
          console.error(response.message);
          this.stateEvent.emit(State.error);
        }
      }, (error: Error) => {
        console.error(error);
        this.stateEvent.emit(State.error);
      });
  }

  public getStateEvent(): EventEmitter<State> {
    return this.stateEvent;
  }
}

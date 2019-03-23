import {EventEmitter, Injectable} from '@angular/core';
import {State} from '../entities/state';
import {HttpClient} from '@angular/common/http';
import {ApiResponse} from '../entities/apiResponse';
import {plainToClassFromExist} from 'class-transformer';
import {environment} from '../../environments/environment';
import {User} from '../entities/user';
import {tap} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private static readonly createUserUri = environment.apiServer + 'api/v1/user/init';
  private static readonly registerUri = environment.apiServer + 'api/v1/user/register';
  private static readonly loginUri = environment.apiServer + 'api/v1/user/login';
  private static readonly logoutUri = environment.apiServer + 'api/v1/user/logout';


  private readonly stateEvent: EventEmitter<State> = new EventEmitter<State>();
  private readonly userEvent: EventEmitter<User|null> = new EventEmitter<User|null>();

  constructor(private httpClient: HttpClient) {
  }

  public init(): void {
    this.stateEvent.emit(State.processing);
    this.httpClient
      .post<ApiResponse<null>>(UserService.createUserUri, null, {withCredentials: true})
      .subscribe((apiResponse: ApiResponse<User>) => {
        const response = plainToClassFromExist(new ApiResponse<User>(User), apiResponse);
        if (response.success) {
          this.userEvent.emit(response.data);
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

  // TODO Implement reinit
  public reinit(): void {
    console.log('Implement reinit');
  }

  public getStateEvent(): EventEmitter<State> {
    return this.stateEvent;
  }

  public getUserEvent(): EventEmitter<User> {
    return this.userEvent;
  }

  public register(username: string, password: string): Observable<ApiResponse<User>> {
    const userData = {
      username: username,
      password: password
    };

    return this.httpClient.post<ApiResponse<User>>(
      UserService.registerUri,
      userData, {withCredentials: true}).pipe(
      tap((apiResponse: ApiResponse<User>) => {
        const response = plainToClassFromExist(new ApiResponse<User>(User), apiResponse);
        console.log(response);
        if (response.success) {
          console.log(response);
        } else {
          console.error(response.message);
        }
      }));
  }

  public login(username: string, password: string): Observable<ApiResponse<User>> {
    const userData = {
      username: username,
      password: password
    };

    return this.httpClient.post<ApiResponse<User>>(
      UserService.loginUri,
      userData, {withCredentials: true}).pipe(
      tap((apiResponse: ApiResponse<User>) => {
        const response = plainToClassFromExist(new ApiResponse<User>(User), apiResponse);
        if (response.success) {
        } else {
          console.error(response.message);
        }
      }));
  }

  public logout(): Observable<ApiResponse<null>> {
    return this.httpClient.post<ApiResponse<null>>(
      UserService.logoutUri,
      null);
  }
}

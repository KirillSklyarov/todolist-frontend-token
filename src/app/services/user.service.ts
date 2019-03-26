import {Injectable} from '@angular/core';
import {State} from '../entities/state';
import {HttpClient} from '@angular/common/http';
import {ApiResponse} from '../entities/apiResponse';
import {plainToClassFromExist} from 'class-transformer';
import {environment} from '../../environments/environment';
import {User} from '../entities/user';
import {tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {EventService} from './event.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private static readonly createUserUri = environment.apiServer + 'api/v1/user/init';
  private static readonly registerUri = environment.apiServer + 'api/v1/user/register';
  private static readonly loginUri = environment.apiServer + 'api/v1/user/login';
  private static readonly logoutUri = environment.apiServer + 'api/v1/user/logout';

  constructor(private httpClient: HttpClient, private eventService: EventService) {
  }

  public init(): void {
    this.eventService.emitState(State.processing);
    this.httpClient
      .post<ApiResponse<User>>(UserService.createUserUri, null, {withCredentials: true})
      .subscribe((response: ApiResponse<User>) => {
        response = plainToClassFromExist(new ApiResponse<User>(User), response);
        if (response.success) {
          this.eventService.emitUser(response.data);
          this.eventService.emitState(State.true);
        } else {
          console.error(response.message);
          this.eventService.emitUser(null);
          this.eventService.emitState(State.error);
        }
      }, (error: Error) => {
        console.error(error);
        this.eventService.emitUser(null);
        this.eventService.emitState(State.error);
      });
  }

  // TODO Implement reinit
  public reinit(): void {
    console.log('Implement reinit');
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

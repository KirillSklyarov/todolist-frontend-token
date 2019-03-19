import {Exclude, Type} from 'class-transformer';

export class ApiResponse<T> {
  @Exclude()
  private type;

  success: boolean;

  message: string;

  @Type(options => {
    return (options.newObject as ApiResponse<T>).type;
  })
  data: T;

  constructor(type: Function) {
    this.type = type;
  }
}

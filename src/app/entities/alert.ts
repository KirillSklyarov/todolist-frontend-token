export class Alert {
  type: string;
  message: string;

  constructor(type: string = Type.primary, message: string = '') {
    this.type = type;
    this.message = message;
  }
}

export enum Type {
  primary = 'primary',
  secondary = 'secondary',
  success = 'success',
  danger = 'danger',
  warning = 'warning',
  info = 'info',
  light = 'light',
  dark = 'dark',
}

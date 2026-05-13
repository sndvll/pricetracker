export enum AlertType {
  Info = 'info',
  Warning = 'warning',
}

export interface AlertConfig<D = any> {
  type: AlertType;
  message: string;
  data?: D;
}

export type ToastKind = 'success' | 'error';

export interface ToastMessage {
  id: number;
  message: string;
  kind: ToastKind;
}

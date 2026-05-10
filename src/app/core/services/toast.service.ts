import { Injectable, signal } from '@angular/core';
import { ToastKind, ToastMessage } from '../../interfaces/toast.interface';

export type { ToastKind, ToastMessage };

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;
  readonly toasts = signal<ToastMessage[]>([]);

  success(message: string): void {
    this.push(message, 'success');
  }

  error(message: string): void {
    this.push(message, 'error');
  }

  dismiss(id: number): void {
    this.toasts.update((list: ToastMessage[]) => list.filter((t: ToastMessage) => t.id !== id));
  }

  private push(message: string, kind: ToastKind): void {
    const id = ++this.nextId;
    this.toasts.update((list: ToastMessage[]) => [...list, { id, message, kind }]);
    window.setTimeout(() => this.dismiss(id), 4500);
  }
}

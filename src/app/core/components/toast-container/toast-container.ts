import { Component } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  template: `
    <div
      class="pointer-events-none fixed top-4 right-4 z-[100] flex max-w-sm flex-col gap-2 sm:max-w-md"
      aria-live="polite"
    >
      @for (t of toastService.toasts(); track t.id) {
        <div
          role="status"
          class="pointer-events-auto flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg"
          [class]="
            t.kind === 'success'
              ? 'border-emerald-200 bg-white text-emerald-900'
              : 'border-red-200 bg-white text-red-900'
          "
        >
          <span class="flex-1">{{ t.message }}</span>
          <button
            type="button"
            (click)="toastService.dismiss(t.id)"
            class="shrink-0 rounded-md p-0.5 text-current opacity-60 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            [attr.aria-label]="'Dismiss notification'"
          >
            &times;
          </button>
        </div>
      }
    </div>
  `,
})
export class ToastContainer {
  constructor(readonly toastService: ToastService) {}
}

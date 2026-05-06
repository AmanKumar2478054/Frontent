import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../Service/auth.service';

@Component({
  selector: 'app-top-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="sticky top-0 z-50 bg-slate-950 text-white shadow-lg">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <a routerLink="/home" class="flex items-center gap-3">
          <span class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 font-bold text-slate-950">GC</span>
          <span class="text-lg font-semibold tracking-wide">GreenCity</span>
        </a>
        <a
          routerLink="/auth/login"
          (click)="logout()"
          class="inline-flex items-center rounded-md bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20"
        >
          Logout
        </a>
      </div>
    </header>
  `,
})
export class TopNavbar {
  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}

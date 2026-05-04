import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagenot-found',
  standalone: true,
  templateUrl: './pagenot-found.html',
})
export class PagenotFound {
  constructor(private router: Router) {}

  public handleRefresh(): void {
    this.router.navigate(['/']);
  }
}

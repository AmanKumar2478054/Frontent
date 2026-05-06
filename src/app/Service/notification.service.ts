import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { NotificationItem } from '../interfaces/notification.interface';
import { UserDetails } from '../core/models/user-details';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationsBaseUrl = 'http://localhost:8082/api/notifications';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getEmailFromToken(): string | null {
    const token = this.authService.getToken();
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length < 2) return null;
    try {
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      return payload?.sub ?? null;
    } catch {
      return null;
    }
  }

  getMyNotifications(): Observable<NotificationItem[]> {
    const email = this.getEmailFromToken();
    if (!email) {
      return of([]);
    }

    return this.authService.getUserByEmail(email).pipe(
      switchMap((user: UserDetails) =>
        this.http.get<NotificationItem[]>(`${this.notificationsBaseUrl}/user/${user.userId}`)
      ),
      map((notifications: NotificationItem[]) =>
        [...(notifications ?? [])].sort(
          (a: NotificationItem, b: NotificationItem) =>
            new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        )
      ),
      catchError((error: unknown) => {
        console.error('Failed to fetch notifications', error);
        return of([]);
      })
    );
  }
}

import { Component, inject } from '@angular/core';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-notification-banner',
  standalone: true,
  template: `
    @if (message(); as msg) {
      <div role="alert">
        <span>{{ msg }}</span>
        <button type="button" (click)="dismiss()">x</button>
      </div>
    }
  `,
})
export class NotificationBanner {
  private readonly notifications = inject(NotificationService);
  readonly message = this.notifications.message;

  dismiss(): void {
    this.notifications.clear();
  }
}

import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationBanner } from './core/notifications/notification-banner';
@Component({
  selector: 'app-root',
  imports: [NotificationBanner, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('FrontendTest');
}

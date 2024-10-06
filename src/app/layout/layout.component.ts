import { Component } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  isLoading = false;
  isCollapsed = false;

  constructor(
    private authService: AuthService
  ) { }

  logout() {
    this.isLoading = true;
    this.authService.logout()
      .subscribe(() => {
        this.isLoading = false;
      });
  }
}

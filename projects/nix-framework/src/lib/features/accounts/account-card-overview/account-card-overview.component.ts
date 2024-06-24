import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HttpService } from '../../../core/services';
import { BaseComponent } from '../../../core/components/base.component';

@Component({
  selector: 'lib-account-card-overview',
  standalone: true,
  imports: [IonicModule],
  providers: [HttpService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './account-card-overview.component.html',
  styleUrl: './account-card-overview.component.css'
})
export class AccountCardOverviewComponent extends BaseComponent {

  constructor(private http: HttpService) {
    super();
  }

  override retry(): void {
    this.getData();
  }

  getData() {
    this.isLoading = true;
    this.hasError  = false;
    this. subscription = this.http.post('', {}).subscribe({
      next: (response) => {
        this.data = response;
      },
      error: (error) => {
        this.hasError = true;
        this.errorMessage = error.message;
      },
      complete: () => this.isLoading = false
    });
  }

}

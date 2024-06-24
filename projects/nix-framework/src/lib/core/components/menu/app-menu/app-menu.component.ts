import { CUSTOM_ELEMENTS_SCHEMA, Component, OnDestroy, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HttpService } from '../../../services';
import { BaseComponent } from '../../base.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppMenuSkeletonComponent } from '../../skeleton';

@Component({
  selector: 'lib-app-menu',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, AppMenuSkeletonComponent],
  providers: [HttpClient, HttpService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app-menu.component.html',
  styleUrl: './app-menu.component.css'
})
export class AppMenuComponent extends BaseComponent implements OnInit, OnDestroy {
  
  segment: string = '';
  // features: {[group: string]:  any[]} = {};
  items: any[] = [];

  constructor(private http: HttpService) {
    super();
  }

  override retry(): void {
    this.getData();
  }

  getData() {
    this.isLoading = true;
    this.hasError  = false;
    this. subscription = this.http.post('http://localhost:3000/api/app/features', {}).subscribe({
      next: (response) => {
        this.data    = response?.data as any[];
        this.segment = this.data.length > 0 ? this.data[0].header : '';
        this.items   = this.data.length > 0 ? this.data[0].child : [];
      },
      error: (error) => {
        this.hasError = true;
        this.errorMessage = error.message;
      },
      complete: () => this.isLoading = false
    });
  }

  onChange($event: any) {
    this.items = this.getMenu(this.data, this.segment);
    console.log('features', this.items);
  }

  getMenu(data: any[], segment: string): any[] {
    const menu = data.find(item => item.header.toLowerCase() === segment.toLowerCase());
    return menu ? menu.child : [];
  }
  
  ngOnInit(): void {
    this.getData();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
        this.subscription.unsubscribe();
    }
    // this.features = {};
    this.items    = [];
    this.segment  = '';
    this.data     = null;
  }

}

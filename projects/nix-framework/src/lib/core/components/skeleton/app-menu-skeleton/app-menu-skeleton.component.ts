import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'lib-app-menu-skeleton',
  standalone: true,
  imports: [CommonModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app-menu-skeleton.component.html',
  styleUrl: './app-menu-skeleton.component.css'
})
export class AppMenuSkeletonComponent {

}

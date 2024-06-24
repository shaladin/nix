import { Directive, Input } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { NgxMaskService } from 'ngx-mask';

@Directive({
  selector: 'ion-input',
  standalone: true
})
export class IonMaskDirective {
    @Input() mask: any;
    constructor(
        private control: IonInput,
        private maskService: NgxMaskService,
    ) {
        this.control.ionChange.subscribe((r: string) => {
            if (!this.mask) {
              return;
            }

            this.control.value = this.maskService.applyMask(String(this.control.value), this.mask);
        });

        this.control.ionFocus.subscribe((r: string) => {
          if (!this.mask) {
            return;
          }

          const value = this.control!.value?.toString().replace(/\./g, '');
          this.control.value = value;
        })
    }
}

import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../../services';
import { FormsModule } from '@angular/forms';
import { ViewContentComponent } from './components/view-content/view-content.component';
import { Template, ViewTemplate } from '../../types';
import { Subscription } from 'rxjs';
import { evaluate } from '../../functions/evaluate';

@Component({
  selector: 'lib-view',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, ViewContentComponent],
  providers: [HttpClient, HttpService],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})
export class ViewComponent extends BaseComponent implements OnDestroy, OnInit {
  
  @Input()
  subscriber!: EventEmitter<{type: string, context: Record<string, any>, subject: string}>;

  @Input({required: true})
  override template!: ViewTemplate | null;

  @Input({required: false})
  override dict: Record<string, any> = {};

  segment: string = '';
  isVisible: boolean = true;
  subscriber$!: Subscription;

  constructor() {
    super();
    this.subscriber = new EventEmitter<{
      type: string, 
      context: Record<string, any>, 
      subject: string
    }>();
  }
  
  override getData(): void {
    if (this.template?.component && this.template.component.length > 0) {
      this.segment = this.template.component[0].header;
    } else {
      this.segment = '';
    }
  }

  override retry(): void {
    this.getData();
  }
  
  ngOnInit(): void {
    // Component not have effect, isVisible: true
    const effectStatement = this.template?.effect; 
    if (!effectStatement) {
      this.isVisible = true;
    } else {
      this.subscriber$ = this.subscriber.subscribe(
        event => {    
          const subject = effectStatement.subject || [];
          if (!subject.includes(event.subject)) return; // Subject in this component not available in effect event.
          
          this.isVisible = evaluate(effectStatement, event.context);
          this.hasError  = false;
        }, err => {
          console.error('Error: ', err);
          this.isLoading = false;
          this.isVisible = false;
          this.hasError  = true;
        }
      )
    }

    if (!this.isVisible) {
      return;
    }

    this.getData();
  }

  applyEffect() {
    //
  }
  
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.subscriber$) {
      this.subscriber$.unsubscribe();
    }

    this.data = null;
    this.dict = {};
    this.template = null;
  }

  onChange($event: any) {
  }

}

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HttpService } from '../../../../services';
import { BaseComponent } from '../../../base.component';
import { ComponentData, Content, FetchDataHttp } from '../../../../types';
import { transformObject, transformValue } from '../../../../functions/object.transformer';

@Component({
  selector: 'lib-view-content',
  standalone: true,
  imports: [CommonModule, IonicModule],
  providers: [HttpClient, HttpService],
  templateUrl: './view-content.component.html',
  styleUrl: './view-content.component.css'
})
export class ViewContentComponent extends BaseComponent implements OnDestroy, OnInit {
  @Input({required: true})
  component: ComponentData = null;

  @Input({required: false})
  override dict: Record<string, any> = {};

  content: Content[] = [];
  
  constructor(private http: HttpService) {
    super();
  }

  ngOnInit(): void {
    this.getData();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.component = null;
    this.content   = [];
    this.dict = {};
    this.data = null;
  }

  override getData(): void {
    this.isLoading  = true;
    const fetchData = this.component.fetchData;

    if (fetchData.type === 'http') {
      const fetchDataHttp: FetchDataHttp = fetchData;
      const serviceUrl  = fetchDataHttp.endpoint.environment + fetchDataHttp.endpoint.path;
      const payload     = transformObject(fetchDataHttp.endpoint.params, this.dict);
      this.subscription = this.http.post(serviceUrl, payload).subscribe({
        next: (response: any) => {
          const result = fetchDataHttp.endpoint.result;
          if (result!.customObject && result!.objectName) {
            this.data = response[result!.objectName];
          } else {
            this.data = response;
          }
          this.setContent();
        }, error: (err) => {
          this.hasError = true;
          console.log('error', err);
        }, complete: () => this.isLoading = false
      })
    } else {
      this.data = transformValue(fetchData.data, this.dict);
      this.setContent();
      setTimeout(() => this.isLoading = false, 1000);
    }
  }

  override retry(): void {
    this.getData();
  }

  setContent() {
    // presented data
    let {content} = this.transform(this.component, this.data);
    this.content  = content;
  }

  transform(subject: any, data: any) {
    const content$: any[] = subject.content;

    const result = content$.map(item => ({
      label: item.label,
      value: transformValue(item.value, data)
    }));

    return {
      header: subject.header,
      content: result
    }
  }

}

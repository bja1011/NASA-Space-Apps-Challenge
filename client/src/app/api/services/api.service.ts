import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { HttpOptions } from '../interfaces/http-options';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private restService: RestService,
  ) {
  }

  request(method: string, path: string, options?: HttpOptions): Observable<any> {
    return this.restService.request(method, this.prepareUrl(path), this.prepareOptions(options));
  }

  prepareUrl(path: string) {
    return environment.apiUrl.concat(path);
  }

  prepareOptions({body, headers}: { body?: any, headers?: any }) {
    const httpOptions = {} as any;
    httpOptions.body = body;
    httpOptions.headers = headers;
    return httpOptions;
  }
}

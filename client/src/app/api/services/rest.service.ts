import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpOptions } from '../interfaces/http-options';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private httpClient: HttpClient,
  ) {
  }

  request(method: string, url: string, options?: HttpOptions) {
    return this.httpClient.request(method, url, options as any);
  }
}

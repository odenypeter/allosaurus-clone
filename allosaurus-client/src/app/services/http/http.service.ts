import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {catchError, EMPTY, retry, shareReplay} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient) {
  }

  public sendRequest(url: string, method: string, body: any=null, multipart=true) {
    let headers = new HttpHeaders();
    if (multipart) {
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
    } else {
      headers = headers.set('Content-Type', 'application/json');
    }

    let options: any = {headers};
    if (body) {
      options['body'] = body;
    }
    return this.httpClient.request(
      method,
      `${environment.API_BASE_URL}${url}`,
      options
    ).pipe(
      retry(2),
      shareReplay(1)
    );
  }
}

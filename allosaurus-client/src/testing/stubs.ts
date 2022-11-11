import {Injectable} from '@angular/core';
import { title } from 'process';
import {EMPTY, Observable, of, throwError} from 'rxjs';

@Injectable()
export class HttpServiceStub {
  public sendRequest(): Observable<any[]> {
    return of([]);
  }
}
@Injectable()
export class AudioServiceStub {
  public startRecording(): Observable<any> {
    return EMPTY;
  }

  public stopRecording(): Observable<any> {
    return EMPTY;
  }

  public recordingFailed(): Observable<any> {
    return EMPTY;
  }

  public getRecordedTime(): any {
    return EMPTY;
  }

  public getRecordedBlob(): Observable<any> {
    return of({title: 'test', blob: {}});
  }
}

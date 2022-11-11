import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

// @ts-ignore
import * as RecordRTC from 'recordrtc';
import * as moment from "moment";

interface RecordedAudioOutput {
  blob: Blob;
  title: string;
}

export interface SampleText {
  title: string;
  passage: string;
  duration: number;
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private stream: any;
  private recorder: any;
  private interval: any;
  private startTime: any;

  // initialize subjects
  private recorded$ = new Subject<RecordedAudioOutput>();
  private recordingTime$ = new Subject<string>();
  private recordingFailed$ = new Subject<string>();

  /**
   * get the recorded audio file as blob
   */
  public getRecordedBlob(): Observable<RecordedAudioOutput> {
    return this.recorded$.asObservable();
  }

  /**
   * get the recording time
   */
  getRecordedTime(): Observable<string> {
    return this.recordingTime$.asObservable();
  }

  /**
   * listen to recording fail
   */
  public recordingFailed(): Observable<string> {
    return this.recordingFailed$.asObservable();
  }


  /**
   * start the recording
   */
  public startRecording() {
    // check if recording is ongoing
    if (this.recorder) {
      return;
    }

    this.recordingTime$.next('00:00');
    navigator.mediaDevices.getUserMedia({audio: true})
      .then(s => {
        this.stream = s;
        this.recordAudio();
      }).catch(error => {
      this.recordingFailed$.next('');
    });

  }

  /**
   * abort the recording
   */
  public terminateRecording() {
    this.stopMedia();
  }

  /**
   * record audio
   * @private
   */
  private recordAudio(): void {

    this.recorder = new RecordRTC.StereoAudioRecorder(this.stream, {
      type: 'audio',
      mimeType: 'audio/wav'
    });

    this.recorder.record();
    this.startTime = moment();
    this.interval = setInterval(
      () => {
        const currentTime = moment();
        const diffTime = moment.duration(currentTime.diff(this.startTime));
        const time = this.formatTime(diffTime.minutes()) + ':' + this.formatTime(diffTime.seconds());
        this.recordingTime$.next(time);
      },
      500
    );
  }

  /**
   * convert time to string
   * @param value
   * @private
   */
  private formatTime(value: any): string {
    let val = value;
    if (!value) {
      val = '00';
    }
    if (value < 10) {
      val = '0' + value;
    }
    return val;
  }

  /**
   * stop audio recording
   */
  public stopRecording() {
    if (this.recorder) {
      this.recorder.stop((blob: Blob) => {
        if (this.startTime) {
          const wavFile = encodeURIComponent('audio_' + new Date().getTime() + '.wav');
          this.stopMedia();
          this.recorded$.next({blob: blob, title: wavFile});
        }
      }, () => {
        this.stopMedia();
        this.recordingFailed$.next('');
      });
    }
  }

  /**
   * clear media data
   * @private
   */
  private stopMedia() {
    if (this.recorder) {
      this.recorder = null;
      clearInterval(this.interval);
      this.startTime = null;
      if (this.stream) {
        this.stream.getAudioTracks().forEach((track: any) => track.stop());
        this.stream = null;
      }
    }
  }
}


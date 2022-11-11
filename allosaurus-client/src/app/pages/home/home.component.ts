import {ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {HttpService} from '../../services/http/http.service';
import {DomSanitizer} from '@angular/platform-browser';
import {AudioService, SampleText } from '../../services/audio/audio.service';
import {NgxFileDropEntry} from 'ngx-file-drop';
import {catchError, EMPTY, map, Observable, Subject, tap} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  // file upload variables
  public files: NgxFileDropEntry[] = [];

  // recording variables
  public isAudioRecording = false;
  public audioRecordedTime: any;
  public audioBlobUrl:any;
  public audioBlob: any;
  public audioName: any;
  public audioStream: any;
  public audioConf = { audio: true}
  public audioFile: any;

  // other variables
  public backendError = false;
  public fileProcessing = false;
  public fileResponse: any;
  public formSubmitted = false;

  public randomText$: Observable<SampleText> = EMPTY;
  public sampleTexts: SampleText[] = [];
  public randomText: any = null;


  constructor(
    private ref: ChangeDetectorRef,
    private httpService: HttpService,
    private domSanitizer: DomSanitizer,
    private audioRecordingService: AudioService,
  ) { }

  ngOnInit() {
    // load random text
    this.randomText$ = this.httpService.sendRequest(
      'texts/',
      'GET',
    ).pipe(
      tap((texts: any) => {
        this.randomText = texts[0];
        this.sampleTexts = texts;
    })
  );

    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isAudioRecording = false;
      this.ref.detectChanges();
    });

    this.audioRecordingService.getRecordedTime().subscribe((time) => {
      this.audioRecordedTime = time;
    });

    this.audioRecordingService.getRecordedBlob().subscribe((data) => {
      if(data) {
        this.audioBlob = data.blob;
        this.audioName = data.title;
        this.audioBlobUrl = this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
        this.audioFile = new File([this.audioBlob], 'sample.wav')
      }
    });
  }

  /**
   * handle file dropped
   * @param files
   */
  public dropped(files: NgxFileDropEntry[]) {
    // remove recorded file if any
    this.audioFile = null;
    this.clearAudioRecordedData()

    // process selected file
    this.files = files;
    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          // Here you can access the real file
          this.audioFile = file;

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  /**
   * submit data to the BE for processing
   */
  public submitAudio() {
    const destroySub$ = new Subject<void>();
    const formData = new FormData();
    formData.append('file', this.audioFile, this.audioFile.name)

    this.fileProcessing = true;
    this.formSubmitted = true;
    this.httpService.sendRequest('process_audio/', 'POST', formData).pipe(
      tap((fileResponse) => {
        if (fileResponse) {
          this.fileProcessing = false;
          this.fileResponse = fileResponse;
        }
      }),
      catchError(error => {
        this.backendError = true;
        destroySub$.next();
        return EMPTY;
      })
    ).subscribe();
  }

  /**
   * commence the actual recording
   */
  startAudioRecording() {
    if (!this.isAudioRecording) {
      this.isAudioRecording = true;
      this.audioRecordingService.startRecording();
    }
  }

  /**
   * stop events and processes in the service
   */
  public terminateAudioRecording() {
    if (this.isAudioRecording) {
      this.isAudioRecording = false;
      this.audioRecordingService.terminateRecording();
    }
  }

  /**
   * stop the recording
   */
  stopAudioRecording() {
    if (this.isAudioRecording) {
      this.audioRecordingService.stopRecording();
      this.isAudioRecording = false;
    }
  }

  /**
   * clear audio recorded data
   */
  clearAudioRecordedData() {
    this.audioBlobUrl = null;
  }

  /**
   * reset the file upload/recording form
   */
  public resetForms() {
    this.audioFile = null;
    this.files = [];
    this.backendError = false;
    this.clearAudioRecordedData();
  }

  /**
   * Get random texts from the list returned by the BE
   */
  public changeSampleText() {
    const pos = Math.floor(Math.random() * (this.sampleTexts.length - 1) + 1)
    this.randomText = this.sampleTexts[pos]
  }

  ngOnDestroy(): void {
    this.terminateAudioRecording();
  }

}

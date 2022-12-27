import { Component, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { combineLatest, forkJoin } from 'rxjs';
import { v4 as uuid } from 'uuid';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';
import IClip from 'src/app/models/clip.model';
import { Router } from '@angular/router';
import { FfmpegService } from 'src/app/services/ffmpeg.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnDestroy {
  isDragOver = false;
  file: File | null = null;
  nextStep = false;

  showAlert = false;
  alertMessage = 'Please wait! Your clip is being uploaded.';
  alertColor = 'blue';
  inSubmission = false;

  percentage = 0;
  showPercentage = false;

  user: firebase.User | null = null;

  // Uploading tasks (clip & screenshot)
  clipTask?: AngularFireUploadTask;
  screenshotTask?: AngularFireUploadTask;

  screenshots: string[] = [];
  selectedScreenshot = '';

  // title = new FormControl('', [Validators.required, Validators.minLength(3)]);

  /* 
    By default, Angular will allow form controls to have a null value.
    In the future => we are not going to allow the title to be null.
    Disable this behaviour by setting the "nonNullable" property => true.
   */
  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });

  uploadForm = new FormGroup({ title: this.title });

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipService: ClipService,
    private router: Router,
    public ffmpegService: FfmpegService
  ) {
    this.auth.user.subscribe((user) => (this.user = user));
    this.ffmpegService.init();
  }

  async processFile($event: Event) {
    if (this.ffmpegService.isRunning) return;

    this.isDragOver = false;

    if ($event instanceof DragEvent) {
      this.file = $event.dataTransfer?.files.item(0) ?? null;
    } else {
      this.file = ($event.target as HTMLInputElement).files?.item(0) ?? null;
    }

    // this.file = ($event as DragEvent).dataTransfer
    //   ? ($event as DragEvent).dataTransfer?.files.item(0) ?? null
    //   : ($event.target as HTMLInputElement).files?.item(0) ?? null;

    if (!this.file || this.file.type !== 'video/mp4') return;

    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));

    this.screenshots = await this.ffmpegService.generateScreenshots(this.file);

    this.selectedScreenshot = this.screenshots.at(0) as string;

    this.nextStep = true;
  }

  async uploadFile() {
    this.uploadForm.disable();

    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMessage = 'Please wait! Your clip is being uploaded.';
    this.inSubmission = true;
    this.showPercentage = true;

    const fileName = uuid();

    const clipPath = `clips/${fileName}.mp4`;

    const screenshotBlob = await this.ffmpegService.blobFromURL(
      this.selectedScreenshot
    );
    const screenshotPath = `screenshots/${fileName}.png`;

    // uploads clip
    this.clipTask = this.storage.upload(clipPath, this.file);

    // uploads screenshot
    this.screenshotTask = this.storage.upload(screenshotPath, screenshotBlob);

    // Can be created before the upload is complete
    const clipRef = this.storage.ref(clipPath);
    const screenshotRef = this.storage.ref(screenshotPath);

    combineLatest([
      this.clipTask.percentageChanges(),
      this.screenshotTask.percentageChanges(),
    ]).subscribe(([clipProgress, screenshotProgress]) => {
      if (!clipProgress || !screenshotProgress) return;

      const total = clipProgress + screenshotProgress;

      this.percentage = total / 200;
    });

    forkJoin([
      this.clipTask.snapshotChanges(),
      this.screenshotTask.snapshotChanges(),
    ])
      .pipe(
        // last(),
        switchMap(() =>
          forkJoin([clipRef.getDownloadURL(), screenshotRef.getDownloadURL()])
        )
      )
      .subscribe({
        next: async ([clipURL, screenshotURL]) => {
          const clip: IClip = {
            uid: this.user!.uid,

            displayName: this.user!.displayName as string,

            title: this.title.value,

            fileName: `${fileName}.mp4`,

            screenshotName: `${fileName}.png`,

            timestamp: firebase.firestore.FieldValue.serverTimestamp(),

            clipURL,

            screenshotURL,
          };

          const clipDocRef = await this.clipService.createClip(clip);

          this.alertColor = 'green';
          this.alertMessage = 'Success! your clip has been uploaded.';
          this.showPercentage = false;

          setTimeout(() => {
            this.router.navigate(['clip', clipDocRef.id]);
          }, 1000);
        },

        error: (error) => {
          this.uploadForm.enable();

          this.alertColor = 'red';
          this.alertMessage = 'Upload failed! Please try again later.';
          this.inSubmission = true;
          this.showPercentage = false;
          console.error(error);
        },
      });
  }

  // Cancel the request when the component is destroyed
  ngOnDestroy(): void {
    this.clipTask?.cancel();
  }
}

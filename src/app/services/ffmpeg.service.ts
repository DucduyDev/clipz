import { Injectable } from '@angular/core';
import { createFFmpeg, FFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root',
})
export class FfmpegService {
  public isReady = false;
  public isRunning = false;

  private ffmpeg: FFmpeg;

  constructor() {
    this.ffmpeg = createFFmpeg({ log: true });
  }

  async init() {
    if (this.isReady) return;

    await this.ffmpeg.load();

    this.isReady = true;
  }

  async generateScreenshots(file: File) {
    try {
      this.isRunning = true;

      // convert File object => binary data
      const data = await fetchFile(file);

      // Store the data in memory
      this.ffmpeg.FS('writeFile', file.name, data);

      const seconds = [1, 2, 3];
      const commands: string[] = [];

      seconds.forEach((second) => {
        commands.push(
          '-i',
          file.name,

          '-ss',
          `00:00:0${second}`,

          '-frames:v',
          '1',

          '-filter:v',
          'scale=510:-1',

          `output_0${second}.png`
        );
      });

      await this.ffmpeg.run(...commands);

      const screenshots = seconds.map((second) => {
        const screenshotFile = this.ffmpeg.FS(
          'readFile',
          `output_0${second}.png`
        );

        // blob => binary large object => an alternative data type to storing binary data
        // browsers can render blob

        // buffer prop => contains actual data of a file
        const screenshotBlob = new Blob([screenshotFile.buffer], {
          type: 'image/png',
        });

        return URL.createObjectURL(screenshotBlob);
      });

      this.isRunning = false;

      return screenshots;
    } catch (err) {
      throw err;
    }

    /*
    await this.ffmpeg.run(
      //Input
      '-i',
      file.name,

      // Output options
      // -ss => configure the current timestamp, timestamp => very beginning of a video (by default)
      '-ss',
      `00:00:01`,

      // -frames:v => a video is a series of images (frame) => configure how many frames to focus on
      '-frames:v',
      '1',

      // resize an image with scale func width:height => -1 => perserves the aspect ratio
      '-filter:v',
      'scale=510:-1',

      // Output
      'output_01.png'
    );
    */
  }

  async blobFromURL(url: string): Promise<Blob> {
    try {
      const response = await fetch(url);

      const blob = await response.blob();

      return blob;
    } catch (err) {
      throw err;
    }
  }
}

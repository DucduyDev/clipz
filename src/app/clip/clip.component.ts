import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import videojs from 'video.js';
import IClip from '../models/clip.model';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ClipComponent implements OnInit {
  @ViewChild('videoPlayer', { static: true }) target?: ElementRef;
  videoPlayer?: videojs.Player;
  clip?: IClip;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.videoPlayer = videojs(this.target?.nativeElement);

    this.route.data.subscribe((data) => {
      this.clip = data.clip as IClip;

      this.videoPlayer?.src({
        src: this.clip.clipURL,
        type: 'video/mp4',
      });
    });

    // this.id = this.route.snapshot.params.id;

    // params observable will push values whenever the route parameters have changed
    // this.route.params.subscribe((params) => {
    //   this.id = params.id;
    // });
  }
}

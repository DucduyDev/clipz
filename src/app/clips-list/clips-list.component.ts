import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ClipService } from '../services/clip.service';

@Component({
  selector: 'app-clips-list',
  templateUrl: './clips-list.component.html',
  styleUrls: ['./clips-list.component.css'],
})
export class ClipsListComponent implements OnInit, OnDestroy {
  @Input() enableInfiniteScrolling = true;

  constructor(public clipService: ClipService) {}

  ngOnInit(): void {
    if (this.enableInfiniteScrolling)
      window.addEventListener('scroll', this.handleScroll.bind(this));

    this.clipService.getClips();
  }

  handleScroll() {
    const { scrollY } = window;
    const { clientHeight, offsetHeight } = document.documentElement;

    const atTheBottom = Math.round(scrollY) + clientHeight === offsetHeight;

    if (atTheBottom) {
      this.clipService.getClips();
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.handleScroll);

    this.clipService.pageClips = [];
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import IClip from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
})
export class ManageComponent implements OnInit {
  videoOrder = '1';
  clips: IClip[] = [];
  activeClip: IClip | null = null;

  sort$: BehaviorSubject<string> = new BehaviorSubject(this.videoOrder);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clipService: ClipService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      this.videoOrder = queryParams.sort === '2' ? queryParams.sort : '1';

      this.sort$.next(this.videoOrder);
    });

    this.clipService.getUserClips(this.sort$).subscribe((docs) => {
      this.clips = docs?.map((doc) => {
        return {
          docID: doc.id,
          ...doc.data(),
        };
      });
    });
  }

  sort($event: Event): void {
    const { value } = $event.target as HTMLSelectElement;

    // this.router.navigateByUrl(`/manage?sort=${value}`);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value,
      },
    });
  }

  openModal(clip: IClip) {
    this.activeClip = clip;

    this.modalService.toggleModal('editClip');
  }

  update($event: IClip) {
    this.clips.forEach((clip) => {
      if (clip.docID === $event.docID) clip.title = $event.title;
    });
  }

  async deleteClip(clip: IClip) {
    try {
      const res = confirm('Are you sure?');

      if (!res) return;

      await this.clipService.deleteClip(clip);

      this.clips = this.clips.filter((c) => c.docID !== clip.docID);
    } catch (err) {
      console.error(err);
    }
  }

  async copyToClipboard(id: string | undefined) {
    if (!id) return;

    const url = `${location.origin}/clip/${id}`;

    await navigator.clipboard.writeText(url);

    alert('Link copied!');
  }
}

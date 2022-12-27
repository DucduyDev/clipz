import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() modalID: string = '';

  constructor(public modalService: ModalService, public el: ElementRef) {}

  ngOnInit(): void {
    document.body.append(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    document.body.removeChild(this.el.nativeElement);
  }

  closeModal() {
    this.modalService.toggleModal(this.modalID);
  }

  @HostListener('document:keydown', ['$event'])
  closeModalWithShortcut(e: KeyboardEvent) {
    if (e.key === 'Escape' && this.modalService.isModalOpen(this.modalID))
      this.closeModal();
  }
}

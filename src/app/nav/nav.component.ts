import { Component, ElementRef, ViewChild } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent {
  @ViewChild('header', { static: true }) header?: ElementRef;

  constructor(public modalService: ModalService, public auth: AuthService) {}

  openModal(e: Event) {
    e.preventDefault();
    this.modalService.toggleModal('auth');
  }
}

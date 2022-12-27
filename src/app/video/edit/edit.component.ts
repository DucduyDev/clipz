import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import IClip from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClip: IClip | null = null;
  @Output() update = new EventEmitter<IClip>();

  showAlert = false;
  alertMessage = 'Please wait! Updating clip.';
  alertColor = 'blue';
  inSubmission = false;

  clipID = new FormControl('', {
    nonNullable: true,
  });

  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });

  editForm: FormGroup = new FormGroup({ title: this.title, id: this.clipID });

  constructor(
    private modalService: ModalService,
    private clipService: ClipService
  ) {}

  ngOnChanges(_: SimpleChanges): void {
    if (!this.activeClip) return;

    this.showAlert = false;

    this.clipID.setValue(this.activeClip.docID as string);
    this.title.setValue(this.activeClip.title);
  }

  ngOnInit(): void {
    this.modalService.register('editClip');
  }

  ngOnDestroy(): void {
    this.modalService.unregister('editClip');
  }

  async editVideo() {
    if (!this.activeClip) return;

    this.showAlert = true;
    this.alertMessage = 'Please wait! Updating clip.';
    this.alertColor = 'blue';
    this.inSubmission = true;

    try {
      await this.clipService.updateClip(this.clipID.value, this.title.value);

      this.activeClip.title = this.title.value;
      this.update.emit(this.activeClip);

      this.alertMessage = 'Success!';
      this.alertColor = 'green';

      setTimeout(() => {
        this.modalService.toggleModal('editClip');
        this.showAlert = false;
        this.inSubmission = false;
      }, 1000);
    } catch (err) {
      console.error(err);

      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMessage = 'Something went wrong! try again later.';
    }
  }
}

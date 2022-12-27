import { Injectable } from '@angular/core';

interface IModal {
  id: string;
  visible: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modals: IModal[] = [];

  constructor() {}

  register(id: string): void {
    this.modals.push({ id, visible: false });
  }

  unregister(id: string): void {
    const index = this.modals.findIndex((modal) => modal.id === id);

    if (index === -1) return;

    this.modals.splice(index, 1);
  }

  isModalOpen(id: string): boolean {
    return !!this.modals.find((modal) => modal.id === id)?.visible;
  }

  toggleModal(id: string): void {
    const modal = this.modals.find((modal) => modal.id === id);

    if (!modal) return;

    modal.visible = !modal.visible;
  }
}

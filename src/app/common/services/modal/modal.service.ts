import { Injectable } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  modal: NzModalRef;

  constructor(private modalService: NzModalService) {}

  confirmationModal(title: string, text: string, okText: string, okDanger: boolean): NzModalRef {
    this.modal = this.modalService.confirm({
      nzTitle: title,
      nzContent: `<div>${text}</div>`,
      nzOkText: okText,
      nzOkDanger: okDanger,
      nzCancelText: 'Anuluj',
    });

    return this.modal;
  }

  createModal(component: any, title: string, width = 400, params?: any, maskClosable: boolean = true): NzModalRef {
    this.modal = this.modalService.create({
      nzTitle: title,
      nzContent: component,
      nzComponentParams: params,
      nzWidth: width,
      nzFooter: null,
      nzMaskClosable: maskClosable,
    });

    return this.modal;
  }

  closeAll(): void {
    this.modalService.closeAll();
  }

  close(): void {
    this.modal?.close({ success: true });
  }

  cancel(): void {
    this.modal?.close({ success: false });
  }
}

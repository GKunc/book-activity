import { Injectable } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  modal: NzModalRef;

  constructor(private modalService: NzModalService) {
  }

  createModal(
    component: any,
    title: string,
    width = 400,
    params?: any,
  ): NzModalRef {

    this.modal = this.modalService.create({
      nzTitle: title,
      nzContent: component,
      nzComponentParams: params,
      nzWidth: width,
      nzFooter: null,
    });

    return this.modal;
  }

  close(): void {
    this.modal?.close({success: true});
  }

  cancel(): void {
    this.modal?.close({success: false});
  }
}

import { Injectable } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private modalService: NzModalService) {
  }

  createModal(
    component: any,
    title: string,
    width: number = 400,
    params?: any,
  ): NzModalRef {

    return this.modalService.create({
      nzTitle: title,
      nzContent: component,
      nzComponentParams: params,
      nzWidth: width,
      nzFooter: null,
    });
  }

  createConfirmationModal(
    title: string,
    content: string,
  ): void {
    this.modalService.confirm({
      nzTitle: title,
      nzContent: content,
      nzOkText: "Tak",
      nzCancelText: "Anuluj",
      nzOnOk: () => console.log('OK')
    });
  }

  close(): void {
    this.modalService.closeAll();
  }
}

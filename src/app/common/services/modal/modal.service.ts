import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private modalService: NzModalService) {
  }

  createModal(
    component: any,
    title: string,
    params?: any,
  ): void {

    const modal = this.modalService.create({
      nzTitle: title,
      nzContent: component,
      nzComponentParams: params,
      nzFooter: null
    });
  }

  close(): void {
    this.modalService.closeAll();
  }
}

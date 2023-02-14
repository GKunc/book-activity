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
    width: number = 400,
    params?: any,
  ): void {

    const modal = this.modalService.create({
      nzTitle: title,
      nzContent: component,
      nzComponentParams: params,
      nzWidth: width,
      nzFooter: null
    });
  }

  close(): void {
    this.modalService.closeAll();
  }
}

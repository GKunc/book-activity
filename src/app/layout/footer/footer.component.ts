import { Component, Input } from '@angular/core';
import { ResizeService } from 'src/app/common/services/resize/resize.service';

@Component({
  selector: 'hub-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less']
})
export class FooterComponent {
  constructor(public resizeService: ResizeService) { }
}

import { Directive, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { environment } from 'src/environments/environment';

@Directive({
  selector: '[hideOnProd]',
})
export class HideOnProdDirective implements OnInit {
  constructor(private templateRef: TemplateRef<any>, private vcr: ViewContainerRef) {}

  ngOnInit(): void {
    if (!window.location.href.includes('localhost')) {
      this.vcr.clear();
      return;
    }
    this.vcr.createEmbeddedView(this.templateRef);
  }
}

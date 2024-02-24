import { Directive, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[hideOnProd]',
})
export class HideOnProdDirective implements OnInit {
  constructor(private templateRef: TemplateRef<any>, private vcr: ViewContainerRef) {}

  ngOnInit(): void {
    this.vcr.createEmbeddedView(this.templateRef);

    if (!window.location.href.includes('localhost')) {
      this.vcr.clear();
      return;
    }
  }
}

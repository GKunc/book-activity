import { Directive, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { EnvironmentService } from '../services/environment/environment.service';

@Directive({
  selector: '[hideOnProd]',
})
export class HideOnProdDirective implements OnInit {
  constructor(
    private templateRef: TemplateRef<any>,
    private vcr: ViewContainerRef,
    private environmentService: EnvironmentService
  ) {}

  ngOnInit(): void {
    if (!this.environmentService.isProd) {
      this.vcr.createEmbeddedView(this.templateRef);
      return;
    }

    this.vcr.clear();
  }
}

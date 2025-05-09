import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[emrUploadAreaMainState]'
})
export class UploadAreaMainStateDirective {
  readonly templateRef = inject(TemplateRef, { optional: true });
}

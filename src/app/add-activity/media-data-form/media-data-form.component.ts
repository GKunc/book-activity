import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { ActivitiesService } from 'src/app/common/services/activities/activities.service';

@Component({
  selector: 'media-data-form',
  templateUrl: './media-data-form.component.html',
  styleUrls: ['./media-data-form.component.less']
})
export class MediaDataFormComponent {
  @Input()
  isLoading: boolean = false;

  @Output()
  formSubmitted: EventEmitter<MediaData> = new EventEmitter<MediaData>();

  @Output()
  previousForm: EventEmitter<any> = new EventEmitter<any>();

  uploading: boolean;

  form = this.fb.group({
    images: ['', [Validators.required]],
  });

  fileList: NzUploadFile[] = [];

  file: any;

  constructor(
    private fb: FormBuilder,
    private activitiesService: ActivitiesService) { }

  previous(): void {
    this.previousForm.emit();
  }

  submit(): void {
    if (this.validateForm()) {
      this.formSubmitted.emit({
        images: [this.form.controls.images.value],
      })
    }
  }

  fileChange(event) {
    let fileList: FileList = event.target.files;
    console.log("FILE", fileList);

    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append('file', file, file.name);

      this.activitiesService.insertPhoto(formData).subscribe((data) => {
        console.log("DATA:", data);
      });
      // let headers = new Headers();
      /** In Angular 5, including the header Content-Type can invalidate your request */
      // headers.append('Content-Type', 'multipart/form-data');
      // headers.append('Accept', 'application/json');
      // let options = new RequestOptions({ headers: headers });
      // this.http.post(`${this.apiEndPoint}`, formData, options)
      //   .map(res => res.json())
      //   .catch(error => Observable.throw(error))
      //   .subscribe(
      //     data => console.log('success'),
      //     error => console.log(error)
      //   )
    }
  }

  private validateForm(): boolean {
    // if (!this.form.valid) {
    //   Object.values(this.form.controls).forEach(control => {
    //     if (control.invalid) {
    //       control.markAsDirty();
    //       control.updateValueAndValidity({ onlySelf: true });
    //     }
    //   });
    //   return false;
    // }
    return true;
  }
}

export interface MediaData {
  images: string[];
}

export function instanceOfMediaData(object: any): object is MediaData {
  return ('images' in object);
}


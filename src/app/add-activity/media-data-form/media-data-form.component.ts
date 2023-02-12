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

  @Input()
  guid: string;

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
      console.log(file.name);

      formData.append('file', file, this.guid + file.name.split('.')[1]);

      this.activitiesService.insertPhoto(formData).subscribe((data) => {
        console.log("DATA:", data);
      });
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


import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivitiesService, Activity } from 'src/app/common/services/activities/activities.service';
import { getUUID } from '../add-activity.component';

@Component({
  selector: 'media-data-form',
  templateUrl: './media-data-form.component.html',
  styleUrls: ['./media-data-form.component.less']
})
export class MediaDataFormComponent implements OnInit {
  @Input()
  activity: Activity;

  @Input()
  isEditing = false;

  @Input()
  isLoading = false;

  @Input()
  guid: string;

  @Output()
  formSubmitted: EventEmitter<MediaData> = new EventEmitter<MediaData>();

  @Output()
  previousForm: EventEmitter<any> = new EventEmitter<any>();

  submitLabel = "Wyślij";

  uploading: boolean = false;
  loadingImages = false;

  images: File[] = [];
  newImages: File[] = [];
  imagesToDelete: string[] = [];

  private fileList: FileList;

  constructor(
    private activitiesService: ActivitiesService) { }

  ngOnInit(): void {
    if (this.activity) {
        this.activity.images?.forEach(image => {
          this.loadingImages = true;
          this.activitiesService.getPhoto(image).subscribe((response) => {
            this.images.push(new File([response], image));
          },
          () => {
            this.loadingImages = false;
          },
          () => this.loadingImages = false,
      )
    })
  }

    if (this.isEditing) {
      this.submitLabel = "Zapisz";
    }
  }

  previous(): void {
    this.previousForm.emit();
  }

  submit(): void {
    if (this.validateForm()) {
      this.uploadFiles();
      this.deleteFiles();
      this.formSubmitted.emit({
        images: this.images.map(image => image.name),
        isEditing: this.isEditing,
      })
    }
  }

  filesChange(event) {
    this.fileList = event.target.files;
    for (let i = 0; i < this.fileList.length; i++) {
      this.newImages.push(this.fileList[i])
      this.images.push(this.fileList[i])
    }
  }

  deleteFile(index: number, image: File) {
    const deletedImage = this.images.splice(index, 1);
    this.newImages = this.newImages.filter(i => i.name !== deletedImage[0].name)
    this.imagesToDelete.push(image.name);
  }


  onFileDropped(files: Array<any>) {
    for (const item of files) {
      this.images.push(item);
      this.newImages.push(item);
    }
  }

  private deleteFiles(): void {
    if (this.imagesToDelete.length > 0) {
      for (let i = 0; i < this.imagesToDelete.length; i++) {
        this.activitiesService.deletePhoto(this.imagesToDelete[i]).subscribe(
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          () => {},
          () => {
            this.isLoading = false;
          },
          () => this.loadingImages = false,
        );
      }
    }
  }

  private uploadFiles(): void {
    if (this.images.length > 0) {
      for (let i = 0; i < this.newImages.length; i++) {
        const file: File = this.newImages[i];
        const formData: FormData = new FormData();
        const guid = getUUID();
        formData.append('file', file, guid);
        const rename = new File([this.newImages[i]], guid);
        this.images = this.images.map(img => {
          if(img.name === this.newImages[i].name) {
            return rename;
          }
          return img;
        })

        this.newImages[i] = rename;
        this.activitiesService.insertPhoto(formData).subscribe(
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          () => {},
          () => {
            this.loadingImages = false;
            this.isLoading = false;
          },
          () => this.loadingImages = false,
        )
      }
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
  isEditing: boolean;
}

export function instanceOfMediaData(object: any): object is MediaData {
  return ('images' in object);
}


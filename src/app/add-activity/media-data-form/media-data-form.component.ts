import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { finalize, forkJoin, map } from 'rxjs';
import { Activity } from 'src/app/common/services/activities/activities.model';
import { ActivitiesService } from 'src/app/common/services/activities/activities.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'media-data-form',
  templateUrl: './media-data-form.component.html',
  styleUrls: ['./media-data-form.component.less'],
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

  submitLabel = 'Wyślij';
  showError = false;
  uploading: boolean = false;
  loadingImages = false;

  images: FileWithUrl[] = [];
  newImages: File[] = [];
  imagesToDelete: string[] = [];

  private fileList: FileList;

  constructor(private activitiesService: ActivitiesService) {}

  ngOnInit(): void {
    if (this.activity.images) {
      this.loadingImages = true;
      forkJoin(
        Array.from(this.activity.images).map((image) =>
          this.activitiesService.getPhoto(image).pipe(
            map((response: Blob) => {
              const file = new File([response], image);
              return { file, url: URL.createObjectURL(file) };
            })
          )
        )
      )
        .pipe(
          finalize(() => {
            this.isLoading = false;
            this.loadingImages = false;
          })
        )
        .subscribe((images) => {
          this.images = images;
        });
    }

    if (this.isEditing) {
      this.submitLabel = 'Zapisz';
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
        images: this.images.map((image) => image.file.name),
        isEditing: this.isEditing,
      });
    }
  }

  filesChange(event) {
    this.fileList = event.target.files;
    for (let i = 0; i < this.fileList.length; i++) {
      this.newImages.push(this.fileList[i]);
      this.images.push({ file: this.fileList[i], url: URL.createObjectURL(this.fileList[i]) });
    }
  }

  deleteFile(index: number, image: File) {
    const deletedImage = this.images.splice(index, 1);
    this.newImages = this.newImages.filter((i) => i.name !== deletedImage[0].file.name);
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
          () => {
            return;
          },
          () => {
            this.isLoading = false;
            this.loadingImages = false;
          },
          () => (this.loadingImages = false)
        );
      }
    }
  }

  private uploadFiles(): void {
    if (this.images.length > 0) {
      for (let i = 0; i < this.newImages.length; i++) {
        const file: File = this.newImages[i];
        const formData: FormData = new FormData();
        const guid = uuidv4();
        formData.append('file', file, guid);
        const rename = new File([this.newImages[i]], guid);
        this.images = this.images.map((img) => {
          if (img.file.name === this.newImages[i].name) {
            return { file: rename, url: img.url };
          }
          return img;
        });

        this.newImages[i] = rename;
        this.activitiesService.insertPhoto(formData).subscribe(
          () => {
            return;
          },
          () => {
            this.loadingImages = false;
            this.isLoading = false;
          },
          () => (this.loadingImages = false)
        );
      }
    }
  }

  private validateForm(): boolean {
    if (this.images.length < 1 || this.images.length > 5) {
      this.showError = true;
      return false;
    }
    this.showError = false;
    return true;
  }
}

export interface MediaData {
  images: string[];
  isEditing: boolean;
}

export function instanceOfMediaData(object: any): object is MediaData {
  return 'images' in object;
}

export interface FileWithUrl {
  file: File;
  url: string;
}

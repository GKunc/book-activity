import { CommonModule, NgFor } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Category } from 'src/app/common/consts/category.consts';
import { DictionaryService } from 'src/app/common/services/dictionary/dictionary.service';
import { SafeHtmlPipe } from './safe-html.pipe';

@Component({
  selector: 'activity-categories',
  templateUrl: './activity-categories.component.html',
  styleUrls: ['./activity-categories.component.less'],
  standalone: true,
  imports: [NgFor, CommonModule, NzIconModule, NzButtonModule, SafeHtmlPipe],
})
export class ActivityCategoriesComponent implements OnInit {
  @Input()
  selectedCategory: Category = null;

  @Output()
  setCategory: EventEmitter<Category> = new EventEmitter();

  @ViewChild('categoriesElement', { read: ElementRef })
  categoriesElement: ElementRef<HTMLElement>;

  showLeftArrow: boolean;
  showRightArrow: boolean = true;
  acitivyCategories: { value: Category; label: string; iconSvg?: string }[];
  dictionaryService: DictionaryService = inject(DictionaryService);

  ngOnInit(): void {
    this.dictionaryService.getDictionary('categories').subscribe((categories) => {
      this.acitivyCategories = categories;
      setTimeout(() => {
        this.showRightArrow =
          this.categoriesElement?.nativeElement?.scrollWidth > this.categoriesElement?.nativeElement?.clientWidth;
      });
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.showRightArrow =
      this.categoriesElement?.nativeElement?.scrollWidth > this.categoriesElement?.nativeElement?.clientWidth;
  }

  onScroll(event): void {
    this.showRightArrow =
      event.srcElement?.scrollLeft + event.srcElement.offsetWidth + 20 < event.srcElement?.scrollWidth;
    this.showLeftArrow = event.srcElement?.scrollLeft > 0;
  }
  scrollLeft(): void {
    this.categoriesElement.nativeElement.scrollTo({
      left: this.categoriesElement.nativeElement.scrollLeft - 150,
      behavior: 'smooth',
    });
  }
  scrollRight(): void {
    this.categoriesElement.nativeElement.scrollTo({
      left: this.categoriesElement.nativeElement.scrollLeft + 150,
      behavior: 'smooth',
    });
  }
}

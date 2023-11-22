import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ACTIVITY_CATEGORIES, Category } from 'src/app/common/consts/category.consts';
import { ACTIVITY_FILTERS } from 'src/app/common/consts/local-storage.consts';
import { LocalStorageService } from 'src/app/common/services/local-storage/local-storage.service';
import { InternalUser, LoginService } from 'src/app/common/services/login-service/login.service';
import { ModalService } from 'src/app/common/services/modal/modal.service';
import { ResizeService } from 'src/app/common/services/resize/resize.service';

@Component({
  selector: 'hub-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less'],
})
export class NavComponent implements OnInit {
  visible = false;

  user: InternalUser;
  userInitials: string;
  categories: Category[];

  categoriesOptions: { value: Category; label: string }[] = ACTIVITY_CATEGORIES;

  phrase = '';

  constructor(
    public loginService: LoginService,
    public resizeService: ResizeService,
    private modalService: ModalService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.loginService._user$?.subscribe((data) => {
      if (data) {
        this.user = data;
        this.userInitials = this.user.username.charAt(0).toUpperCase();
        this.modalService.close();
      }
    });
  }

  searchActivities(): void {
    this.localStorageService.setItem(ACTIVITY_FILTERS, {
      phrase: this.phrase,
      categories: this.categories,
      minPrice: 0,
      maxPrice: 1000,
      page: 1,
      limit: 10,
    });
    this.phrase = '';
    this.categories = [];
    this.router.navigate(['find-activities']);
  }

  signOut(): void {
    this.loginService.signOut();
    this.router.navigate(['/sign']);
  }

  openLoginScreen(): void {
    this.router.navigate(['sign']);
  }

  openMobileMenu(): void {
    this.visible = true;
  }

  closeMobileMenu(): void {
    this.visible = false;
  }
}

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Activity, GroupDetails } from 'src/app/common/services/activities/activities.model';
import { LoginService } from 'src/app/common/services/login-service/login.service';
import { UserService } from 'src/app/common/services/user/user.service';

@Component({
  selector: 'app-paid-activities',
  templateUrl: './paid-activities.component.html',
  styleUrls: ['./paid-activities.component.less'],
})
export class PaidActivitiesComponent implements OnInit {
  loading: boolean = false;
  error: boolean = false;
  noData: boolean = false;
  groups: GroupDetails[] = [];

  constructor(private loginService: LoginService, private userService: UserService) {}

  ngOnInit(): void {
    this.loading = true;
    this.userService.getEnrolledGroups(this.loginService.loggedUser).subscribe((data) => {
      this.groups = data;
      this.loading = false;
    });
  }

  deleteEnrolledGroup(group: GroupDetails): void {
    console.log(group, this.groups);
    this.userService.deleteEnrolledGroup(this.loginService.loggedUser, group).subscribe(() => {
      this.groups = this.groups.filter((item) => item._id !== group._id);
    });
  }
}

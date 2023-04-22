import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivityComment } from 'src/app/common/services/comments/comments.model';
import { LoginService } from 'src/app/common/services/login-service/login.service';

@Component({
  selector: 'activity-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.less'],
})
export class CommentsComponent {
  @Input()
  activityId: string;

  @Input()
  comments: ActivityComment[];

  @Input()
  submitting: boolean;

  @Input()
  enableCommenting: boolean;

  @Output()
  addComment: EventEmitter<ActivityComment> = new EventEmitter();

  inputValue: string = '';
  rate: number = 0;

  constructor(public loginService: LoginService) {}

  createComment(): void {
    this.addComment.emit({
      activityId: this.activityId,
      userId: this.loginService.loggedUser.id,
      userName: this.loginService.loggedUser.username,
      content: this.inputValue,
      rate: this.rate,
      addedDate: new Date(),
    });
    this.inputValue = '';
    this.rate = 0;
    this.enableCommenting = false;
  }
}

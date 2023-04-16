import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Activity } from 'src/app/common/services/activities/activities.model';
import { ActivityComment } from 'src/app/common/services/comments/comments.model';
import { CommentsService } from 'src/app/common/services/comments/comments.service';

@Component({
  selector: 'activity-opinions',
  templateUrl: './opinions.component.html',
  styleUrls: ['./opinions.component.less']
})
export class OpinionsComponent implements OnInit {
  @Input()
  activity: Activity = null;

  @Output()
  avgRateChanged: EventEmitter<number> = new EventEmitter();

  submitting: boolean = false;
  avgRate: number = 0;
  comments: ActivityComment[] = [];
  starsMap: Map<number, number> = new Map();

  constructor(
    private commentsService: CommentsService,
  ) {}

  ngOnInit(): void {
    this.commentsService.getComments(this.activity?.guid).subscribe(data => {
      this.comments = data;
      this.updateAvgRate();
      this.updateRatesStars();
    })
  }

  updateRatesStars(): void {
    const stars = new Map<number, number>([
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
    ]);

    this.comments.forEach(comment => {
      const rate = Math.round(comment.rate);
      stars.set(rate, stars.get(rate)+1);
    })

    this.starsMap = stars;
    
  } 

  updateAvgRate(): void {
    if(this.comments.length === 0) {
      this.avgRate = 0;
    }

    this.avgRate = this.comments.reduce((sum, value) => {
      return sum + value.rate;
    }, 0) / this.comments.length;

    this.avgRateChanged.emit(this.avgRate);
  }

  onAddComment(comment: ActivityComment): void {
    this.submitting = true;

    this.commentsService.addComment(comment).subscribe(() => {
      this.comments = [
        ...this.comments,
        comment,
      ];
      this.submitting = false;
      this.updateAvgRate();
    });

  }
}
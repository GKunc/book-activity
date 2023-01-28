import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'hub-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.less']
})
export class NavItemComponent implements OnInit {

  @Input()
  text: string | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}

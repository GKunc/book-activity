import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'hub-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.less']
})
export class ButtonComponent implements OnInit {

  @Input()
  text: string | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}

import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

import { Poll, Results } from '../../../shared/models/poll.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'results-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {

  @Input() results: Results;
  @Input() round: number;

  threshold:number = .50;

  constructor() { }

  ngOnInit() {
  }

  getWidth(percentage:number) {
    let width = percentage/this.threshold * 100;
    if(width >= 101){
      return 101;
    } else {
      return width;
    }
  }

}

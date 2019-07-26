import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-results',
  styleUrls: ['./results.component.scss'],
  template: `

      <header class="poll-header">
          <h1 class="">poll.title</h1>  
      </header>

      <main>
          <h2 class="mt-3 mb-1">Final Result</h2>
          <p class="mb-1">3,957 Votes in 3 Rounds</p>
          
          <hr>
          <div class="mb-3 mt-1">
            <results-graph [results]="tempResults" [round]="'1'"></results-graph>
          </div>

          <hr>

          <h2 class="mt-3 mb-1">Poll Summary</h2>

          <p class="mb-2">After 3 rounds, Jordin Sparks wins with 1226 first-choice votes, 324 second-choice votes, and 99 third-choice votes.</p> 
          <p class="mb-3">Ranked Choice Voting is different from choose-only-one voting. If no singer gets 50% of the vote in round one, the singer with the fewest votes is eliminated and their voters get their next choice. See how Ranked Choice worked for this poll by clicking through the rounds.</p>
      </main>




  `
})
export class ResultsComponent implements OnInit {

  tempResults = [
    {
    'percentages': [.31, .49, .52],
    'label': 'Jordin Sparks',
    'initial_order': 0,
    'victory_round': 1,
    'elimination_round': null
    },
    {
    'percentages': [.31, .33, .41],
    'label': 'Chris Daughtry',
    'initial_order': 2,
    'victory_round': null,
    'elimination_round': null
    },
    {
    'percentages': [.16, .16, .16],
    'label': 'Kelly Clarkson',
    'initial_order': 1,
    'victory_round': null,
    'elimination_round': null
    },
    {
    'percentages': [.08, .08, 0],
    'label': 'Ruben Studdard',
    'initial_order': 4,
    'victory_round': null,
    'elimination_round': null
    },
    {
    'percentages': [.08, .0, 0],
    'label': 'Taylor Hicks',
    'initial_order': 4,
    'victory_round': null,
    'elimination_round': 2
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from 'store';
import { Poll } from '../../../shared/models/poll.interface';
import { VoteService } from '../../../shared/services/vote.service';





@Component({
  selector: 'app-success',
  styleUrls: ['./success.component.scss'],
  template: `

  <ng-container *ngIf="poll">
  <success-card 
  [poll]="poll"
  [fromVote]="'true'"></success-card>
<footer class="actions" *ngIf="poll.results_public">
    <button *ngIf="poll.results_public"  [ngStyle]="{'backgroundColor': poll.customizations?.buttonColor1 != '' ? poll.customizations?.buttonColor1 : '#ff4081;'}"
      [routerLink]="['/results', poll.id, 'summary']" 
      mat-button mat-raised-button [color]="'accent'" 
      class="d-block has-icon dark-icon button-large p-1">View Results</button>
</footer></ng-container>
  `
})
export class SuccessComponent implements OnInit {
  poll$: Observable<Poll> = this.store.select('poll');
  poll: Poll = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private voteService: VoteService,
    private store: Store) { }

  ngOnInit() {
    const user = this.route.snapshot.data.resolverUser;



    this.route.paramMap
      .subscribe((params: ParamMap) => {
        const id = params.get('id');
        if (id) {
          this.poll$ = this.voteService.getPoll(id);
          this.poll$.subscribe(res => {
            this.poll = res;
            if (this.voteService.hasVoted(this.poll) === false) {

              this.router.navigate(['/vote/', id]);
            }
          });

          if (user) {
            this.store.set('backButton', ['/polls/', id]);
          } else {
            this.store.set('backButton', `/`);
          }
        } else {
          this.router.navigate(['/vote/not-found']);

        }

      });
  }

}

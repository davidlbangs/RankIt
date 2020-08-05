import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

import { AppSettings } from '../../../app.settings';

import { Poll } from '../../../shared/models/poll.interface';

@Component({
  selector: 'share-poll',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex-grid mb-1 sharePoll">
          <button style="max-width:150px;"
              mat-stroked-button color="primary" class="has-icon bg-white"
              (click)="copyVoteLink(voteLink)"><i class="fa fa-link"></i>Copy Link</button>
          <a style="max-width:150px;"
            target="_BLANK"
            href="{{ buildTweetLink(voteLink, poll.title)}}" 
            mat-stroked-button color="primary" class="has-icon bg-white"><i class="fa fa-twitter"></i>Tweet</a>
          <a style="max-width:150px;"
            mat-stroked-button color="primary" class="has-icon bg-white"
            target="_BLANK"
            href="{{ buildFacebookLink(voteLink)}}" ><i class="fa fa-facebook-f"></i>Post</a>
    </div>
  `,
  styleUrls: ['./share-poll.component.scss']
})
export class SharePollComponent implements OnInit {
  @Input() poll:Poll;

  get id() { return this.poll.id }
  get voteLink() { return AppSettings.productionUrl + '/vote/' + this.id }

  constructor(
              private _snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  copyVoteLink(val:string) {
    this.copyToClipboard(val);

    this.openSnackBar('Copied to clipboard!', 'Close');
  }

  buildTweetLink(voteLink:string, title: string) {
    const encodedUrl = encodeURI(voteLink);
    const encodedText = encodeURI('Vote in this poll! ' + title);
    return `https://twitter.com/intent/tweet?url=${encodedUrl}&via=fairvote&text=${encodedText}`;
  }

  buildFacebookLink(voteLink:string) {
    return `https://www.facebook.com/sharer/sharer.php?u=${voteLink}`;
  }

  copyToClipboard(val: string){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

}

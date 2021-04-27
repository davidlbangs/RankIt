import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AppSettings } from '../../../app.settings';
import { Poll } from '../../../shared/models/poll.interface';

@Component({
  selector: 'embed-poll',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button 
              mat-stroked-button color="primary" class="has-icon"
              (click)="copyEmbedCode(voteLink)"><i class="fa fa-code"></i> Copy Embed Code</button>
  `,
  styleUrls: ['./embed-poll.component.scss']
})
export class EmbedPollComponent implements OnInit {
  @Input() poll:Poll;

  get id() { return this.poll.id }
  get voteLink() { return AppSettings.productionUrl + '/vote/' + this.id }

  constructor(
              private _snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  copyEmbedCode(voteLink:string) {
    const embedCode = this.buildEmbedCode(voteLink);
    this.copyToClipboard(embedCode);

    this.openSnackBar('Copied embed code to clipboard!', 'Close');
  }

  buildEmbedCode(voteLink:string) {
    return '<div style="position:relative;overflow:hidden;padding-top:120%;"><iframe src="' + voteLink + '" style="border:1px solid #f1f1f1;position: absolute;top: 0;left: 0;width: 100%;height: 100%;" name="myiFrame" scrolling="yes" frameborder="1" marginheight="0px" marginwidth="0px" allowfullscreen></iframe></div>';
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

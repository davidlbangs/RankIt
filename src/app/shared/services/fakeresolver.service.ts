import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

@Injectable()
export class FakeUserResolver implements Resolve<any> {

  constructor(
    ) { }

  resolve() {
    console.log("checking for user3");
    return null;
  }
}
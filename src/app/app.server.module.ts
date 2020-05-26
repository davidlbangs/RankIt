import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { PlatformLocation } from '@angular/common';
import { ExpressRedirectPlatformLocation } from './redirect';
import {FlexLayoutServerModule} from '@angular/flex-layout/server';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    FlexLayoutServerModule
  ],
  bootstrap: [AppComponent],
  providers: [
  //  { provide: PlatformLocation, useClass: ExpressRedirectPlatformLocation },
  ],
})
export class AppServerModule {}

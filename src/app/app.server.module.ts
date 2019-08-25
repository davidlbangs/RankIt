import { NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';


@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule, //  <-- needed for state transfer
    ModuleMapLoaderModule // <-- needed for lazy-loaded routes
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}

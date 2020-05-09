import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from 'app/app.module';

if (environment.production) {
  enableProdMode();
}
// for showing loading indicator
platformBrowserDynamic().bootstrapModule(AppModule)
  .then(() => {
    console.log('LOADED');
    // hide loading here dom.remove()
  })
  .catch(err => console.log(err));


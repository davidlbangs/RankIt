import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// components
import { AuthFormComponent } from './components/auth-form/auth-form.component';

// services
import { AuthService } from './services/auth/auth.service';

// guards
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [
    AuthFormComponent
  ], exports: [
    AuthFormComponent
  ]
})
export class SharedModule {

  // for root here keeps from duplicating.
  // otherwise it would duplicate auth service.
  // only need to use forRoot() once, in root module.
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        AuthService,
        AuthGuard,
        AdminGuard
      ]
    };
  }
}
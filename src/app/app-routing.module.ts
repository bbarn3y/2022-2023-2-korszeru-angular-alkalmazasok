import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "src/app/login/login.component";
import {AuthenticatedComponent} from "src/app/authenticated/authenticated.component";
import {PageRoutes} from "src/app/_constants/page.routes";
import {PublicGuard} from "src/app/_guards/public.guard";
import {SessionGuard} from "src/app/_guards/session.guard";
import {KonvaComponent} from "src/app/konva/konva.component";

const routes: Routes = [
  {
    path: PageRoutes.login,
    component: LoginComponent,
    canActivate: [PublicGuard],
    loadChildren: () => import('./authentication/authentication.module').then((m) => m.AuthenticationModule)
  },
  {
    path: PageRoutes.authenticated,
    component: KonvaComponent,
    canActivate: [SessionGuard],
    canActivateChild: [SessionGuard],
    loadChildren: () => import('./inner/inner.module').then((m) => m.InnerModule)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

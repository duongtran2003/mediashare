import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./modules/hot-col/hot-col.module').then((m) => m.HotColModule) },
  { path: 'new', loadChildren: () => import('./modules/new-col/new-col.module').then((m) => m.NewColModule) },
  { path: 'home', loadChildren: () => import('./modules/home-col/home-col.module').then((m) => m.HomeColModule) },
  { path: 'user/:username', loadChildren: () => import('./modules/user-profile/user-profile.module').then((m) => m.UserProfileModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

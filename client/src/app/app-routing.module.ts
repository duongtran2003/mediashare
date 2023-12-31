import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authRouteGuard } from './guards/auth-route.guard';

const routes: Routes = [
  { path: '', loadChildren: () => import('./modules/hot-col/hot-col.module').then((m) => m.HotColModule) },
  { path: 'new', loadChildren: () => import('./modules/new-col/new-col.module').then((m) => m.NewColModule), canActivate: [authRouteGuard] },
  { path: 'home', loadChildren: () => import('./modules/home-col/home-col.module').then((m) => m.HomeColModule), canActivate: [authRouteGuard] },
  { path: 'user/:username', loadChildren: () => import('./modules/user-profile/user-profile.module').then((m) => m.UserProfileModule) },
  { path: 'post/:post_id', loadChildren: () => import('./modules/detailed-post/detailed-post.module').then((m) => m.DetailedPostModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

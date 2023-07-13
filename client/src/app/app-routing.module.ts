import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeColComponent } from './components/home-col/home-col.component';
import { HotColComponent } from './components/hot-col/hot-col.component';
import { NewColComponent } from './components/new-col/new-col.component';

const routes: Routes = [
  { path: '', loadChildren: () => import('./modules/hot-col/hot-col.module').then((m) => m.HotColModule) },
  { path: 'new', loadChildren: () => import('./modules/new-col/new-col.module').then((m) => m.NewColModule) },
  { path: 'home', loadChildren: () => import('./modules/home-col/home-col.module').then((m) => m.HomeColModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

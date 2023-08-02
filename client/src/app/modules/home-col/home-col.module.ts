import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeColComponent } from 'src/app/components/home-col/home-col.component';
import { RouterModule, Routes } from '@angular/router';
import { PostModule } from '../post/post.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

const homeColRoutes: Routes = [{ path: '', component: HomeColComponent }];

@NgModule({
  declarations: [HomeColComponent, ],
  imports: [
    CommonModule, RouterModule.forChild(homeColRoutes), PostModule, InfiniteScrollModule,
  ]
})
export class HomeColModule { }

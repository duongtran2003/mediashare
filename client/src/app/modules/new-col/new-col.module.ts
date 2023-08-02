import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewColComponent } from 'src/app/components/new-col/new-col.component';
import { RouterModule, Routes } from '@angular/router';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PostModule } from '../post/post.module';

const newColRoutes: Routes = [{ path: '', component: NewColComponent }];

@NgModule({
  declarations: [NewColComponent, ],
  imports: [
    CommonModule, RouterModule.forChild(newColRoutes), InfiniteScrollModule, PostModule
  ]
})
export class NewColModule { }

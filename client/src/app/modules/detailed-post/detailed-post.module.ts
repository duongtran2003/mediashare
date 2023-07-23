import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DetailedPostComponent } from 'src/app/components/detailed-post/detailed-post.component';
import { PostModule } from '../post/post.module';

const detailedPostRoutes: Routes = [{ path: '', component: DetailedPostComponent }];

@NgModule({
  declarations: [DetailedPostComponent],
  imports: [
    CommonModule, RouterModule.forChild(detailedPostRoutes), PostModule,
  ]
})
export class DetailedPostModule { }

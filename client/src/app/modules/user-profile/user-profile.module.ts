import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from 'src/app/components/user-profile/user-profile.component';
import { RouterModule, Routes } from '@angular/router';
import { ImageCropperModule } from 'ngx-image-cropper';
import { PostModule } from '../post/post.module';

const profileRoutes: Routes = [{ path: '', component: UserProfileComponent }];

@NgModule({
  declarations: [UserProfileComponent],
  imports: [
    CommonModule, RouterModule.forChild(profileRoutes), ImageCropperModule, PostModule
  ]
})
export class UserProfileModule { }

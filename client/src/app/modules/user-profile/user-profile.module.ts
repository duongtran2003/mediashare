import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from 'src/app/components/user-profile/user-profile.component';
import { RouterModule, Routes } from '@angular/router';

const profileRoutes: Routes = [{ path: '', component: UserProfileComponent }];

@NgModule({
  declarations: [UserProfileComponent],
  imports: [
    CommonModule, RouterModule.forChild(profileRoutes),
  ]
})
export class UserProfileModule { }

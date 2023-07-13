import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotColComponent } from 'src/app/components/hot-col/hot-col.component';
import { RouterModule, Routes } from '@angular/router';

const hotColRoutes: Routes = [{ path: '', component: HotColComponent }];

@NgModule({
  declarations: [HotColComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(hotColRoutes)
  ]
})
export class HotColModule { }

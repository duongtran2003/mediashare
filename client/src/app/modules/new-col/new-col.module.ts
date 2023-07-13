import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewColComponent } from 'src/app/components/new-col/new-col.component';
import { RouterModule, Routes } from '@angular/router';

const newColRoutes: Routes = [{ path: '', component: NewColComponent }];

@NgModule({
  declarations: [NewColComponent],
  imports: [
    CommonModule, RouterModule.forChild(newColRoutes),
  ]
})
export class NewColModule { }

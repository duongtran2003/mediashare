import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from 'src/app/components/post/post.component';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [PostComponent],
  imports: [
    CommonModule, RouterModule, FontAwesomeModule,
  ],
  exports: [PostComponent]
})
export class PostModule { }

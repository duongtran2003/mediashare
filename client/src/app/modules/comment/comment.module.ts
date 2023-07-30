import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentComponent } from 'src/app/components/comment/comment.component';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [CommentComponent],
  imports: [
    CommonModule, RouterModule, FontAwesomeModule,
  ],
  exports: [CommentComponent]
})
export class CommentModule { }

import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-new-col',
  templateUrl: './new-col.component.html',
  styleUrls: ['./new-col.component.css']
})
export class NewColComponent implements OnInit {

  private api = inject(ApiService);

  excluded: string[] = [];
  posts: any[] = [];

  isQueryCallPending: boolean = false;

  ngOnInit(): void {
    this.api.post('post/newQuery', { batchSize: 2, excluded: this.excluded }).subscribe({
      next: (res) => {
        this.posts = [];
        for (let post of res) {
          this.posts.push(post);
          this.excluded.push(post._id);
        }
        console.log(this.posts, this.excluded);
      }
    })
  }

  onScroll() {
    if (this.isQueryCallPending) {
      return;
    }
    this.isQueryCallPending = true;
    this.api.post('post/newQuery', { batchSize: 2, excluded: this.excluded }).subscribe({
      next: (res) => {
        if (!res.length) {
          this.isQueryCallPending = false;
          return;
        }
        for (let post of res) {
          this.posts.push(post);
          this.excluded.push(post._id);
        }
        this.isQueryCallPending = false;
      }
    })
  }
}

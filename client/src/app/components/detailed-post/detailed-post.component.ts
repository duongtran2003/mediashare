import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-detailed-post',
  templateUrl: './detailed-post.component.html',
  styleUrls: ['./detailed-post.component.css']
})
export class DetailedPostComponent implements OnInit {

  posts: any[] = [];

  private router = inject(ActivatedRoute);
  private api = inject(ApiService);
  private toast = inject(ToastService);

  ngOnInit(): void {
    this.router.params.subscribe(async (params) => {
      const post_id = params['post_id'];
      this.api.post('post/queryById', { post_id: post_id }).subscribe({
        next: (res) => {
          this.posts = [res.post];
        },
        error: (err) => {
          if (err.status == 404) {
            this.toast.makeToast({
              state: "close",
              message: "Post not found",
              barClass: ['bg-red-600'],
            })
          }
        }
      })
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-detailed-post',
  templateUrl: './detailed-post.component.html',
  styleUrls: ['./detailed-post.component.css']
})
export class DetailedPostComponent implements OnInit {

  posts: any[] = [];
  constructor(private router: ActivatedRoute, private api: ApiService) {  }

  ngOnInit(): void {
    this.router.params.subscribe(async (params) => {
      const post_id = params['post_id'];
      this.api.post('post/queryById', { post_id: post_id }).subscribe({
        next: (res) => {
          this.posts = [res.post];
          console.log(this.posts);
        },
        error: (err) => {
          console.log(err);
        }
      })
    });
  }
}

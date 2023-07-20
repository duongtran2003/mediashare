import { Component, Input, OnInit } from '@angular/core';
import { faComments } from '@fortawesome/free-regular-svg-icons';
import { IconDefinition, faAngleDown, faAngleUp, faChevronCircleDown, faChevronCircleUp } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() post: any;
  username: string = "";
  title: string = "";
  filename: string = "";
  fileType: string = "";
  avatar: string = "";
  filePath: string = "";
  upvoteIcon: IconDefinition = faChevronCircleUp;
  downvoteIcon: IconDefinition = faChevronCircleDown;
  commentsIcon: IconDefinition = faComments;

  constructor(private api: ApiService) {

  }
  ngOnInit(): void {
    this.username = this.post.username;
    this.title = this.post.title;
    this.fileType = this.post.fileType;
    this.filename = this.post.filename;
    this.filePath = `http://localhost:8000/static/${this.filename}`;
    this.api.post('user/getUserInfo', { username: this.username }).subscribe({
      next: (response) => {
        this.avatar = response.avatarPath;
      },
      error: (err) => {
        this.avatar = 'http://localhost:8000/static/default.png';
      }
    });
  }
}

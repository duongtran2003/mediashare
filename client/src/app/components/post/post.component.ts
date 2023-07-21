import { Component, Input, OnInit } from '@angular/core';
import { faComments } from '@fortawesome/free-regular-svg-icons';
import { IconDefinition, faAngleDown, faAngleUp, faChevronCircleDown, faChevronCircleUp } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  @Input() post: any;
  username: string = "";
  title: string = "";
  filename: string = "";
  fileType: string = "";
  avatar: string = "";
  filePath: string = "";
  karma: number = 0;
  _id: string = "";
  vote: number = 0;
  btnState: string = "0";
  isVoteBtnReady: boolean = false;
  upvoteIcon: IconDefinition = faChevronCircleUp;
  downvoteIcon: IconDefinition = faChevronCircleDown;
  commentsIcon: IconDefinition = faComments;


  constructor(private api: ApiService, private auth: AuthService) {

  }
  ngOnInit(): void {
    this.username = this.post.username;
    this.title = this.post.title;
    this.fileType = this.post.fileType;
    this.filename = this.post.filename;
    this.filePath = `http://localhost:8000/static/${this.filename}`;
    this.karma = this.post.karma;
    this._id = this.post._id;
    this.api.post('user/getUserInfo', { username: this.username }).subscribe({
      next: (response) => {
        this.avatar = response.avatarPath;
      },
      error: (err) => {
        this.avatar = 'http://localhost:8000/static/default.png';
      }
    });
    console.log({ username: this.auth.getCurrentUser(), post_id: this._id })
    this.api.post('vote/getUserVote', { post_id: this._id }).subscribe({
      next: (response) => {
        this.vote = response.type;
        this.isVoteBtnReady = true;
      },
      error: (err) => {
        this.isVoteBtnReady = true;
      }
    })
  }

  onUpvoteClick(): void {
    if (this.vote == 1) {
      this.vote = 0;
      this.isVoteBtnReady = false;
      this.api.post('vote/removeVote', { post_id: this._id, type: 1 }).subscribe({
        next: (response) => {
          this.isVoteBtnReady = true;
          this.karma = response.karma;
        },
        error: (err) => {
          this.isVoteBtnReady = true;
        }
      });
    }
    else {
      this.isVoteBtnReady = false;
      if (this.vote == -1) {
        this.api.post('vote/changeVote', { post_id: this._id, type: 1 }).subscribe({
          next: (response) => {
            this.isVoteBtnReady = true;
            this.karma = response.karma;
          },
          error: (err) => {
            this.isVoteBtnReady = true;
          }
        })
      }
      else {
        this.api.post('vote/votePost', { post_id: this._id, type: 1 }).subscribe({
          next: (response) => {
            this.isVoteBtnReady = true;
            this.karma = response.karma;
          },
          error: (err) => {
            this.isVoteBtnReady = true;
          }
        })
      }
      this.vote = 1;
    }
  }
  onDownvoteClick(): void {
    if (this.vote == -1) {
      this.vote = 0;
      this.isVoteBtnReady = false;
      this.api.post('vote/removeVote', { post_id: this._id, type: -1 }).subscribe({
        next: (response) => {
          this.isVoteBtnReady = true;
          this.karma = response.karma;
        },
        error: (err) => {
          this.isVoteBtnReady = true;
        }
      });
    }
    else {
      this.isVoteBtnReady = false;
      if (this.vote == 1) {
        this.api.post('vote/changeVote', { post_id: this._id, type: -1 }).subscribe({
          next: (response) => {
            this.isVoteBtnReady = true;
            this.karma = response.karma;
          },
          error: (err) => {
            this.isVoteBtnReady = true;
          }
        })
      }
      else {
        this.api.post('vote/votePost', { post_id: this._id, type: -1 }).subscribe({
          next: (response) => {
            this.isVoteBtnReady = true;
            this.karma = response.karma;
          },
          error: (err) => {
            this.isVoteBtnReady = true;
          }
        })
      }
      this.vote = -1;
    }
  }
}
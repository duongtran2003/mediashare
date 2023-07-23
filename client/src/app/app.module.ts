import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ToastWrapperComponent } from './components/toast-wrapper/toast-wrapper.component';
import { ToastComponent } from './components/toast/toast.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavColComponent } from './components/nav-col/nav-col.component';
import { NavColItemComponent } from './components/nav-col-item/nav-col-item.component';
import { SearchItemComponent } from './components/search-item/search-item.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { DetailedPostComponent } from './components/detailed-post/detailed-post.component';


const config: SocketIoConfig = { url: 'http://localhost:8000' };


@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    LoginComponent,
    RegisterComponent,
    ToastWrapperComponent,
    ToastComponent,
    NavColComponent,
    NavColItemComponent,
    CreatePostComponent,
    SearchItemComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }

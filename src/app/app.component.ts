import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private router: Router){
  }

  ngOnInit() {
      /*if ((!localStorage.getItem('Auth_Token')) && (!(this.router.url === '/forgot-password')) && (!(this.router.url === '/reset-password'))) {
          console.log(this.router.url)
          this.router.navigate(['/']);
      }*/
  }

}

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {  Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginObj: any = {
    "username": "",
    "password": ""
  };
  authenticate:string = "Login"
  token:string = ""
  constructor(private router: Router, private apollo: Apollo){}

  ngOnInit(): void {
    // if (this.auth.isLoggedIn()) {
    //   this.router.navigateByUrl('/dashboard'); 
    // }
    localStorage.setItem('authenticating', "true");
  }
  onLogin() {
    this.authenticate = "authenticating...";
    console.log(this.loginObj);
    // debugger;
    this.apollo
    .watchQuery({
      query: gql`
      {
        login(
          username: "${this.loginObj.username}",
          password: "${this.loginObj.password}"
          ){
            sessionToken
          }
      }      
      `,
      fetchPolicy: 'network-only'
    })
    .valueChanges.subscribe((result: any) => {
      // this.todosService.deserializeItem(result?.data?.find.edges ?? [])
      this.token = result?.data?.login.sessionToken;
      if (this.token == null) {
        this.authenticate = "Failed retry";
      }
      else{
        localStorage.setItem('token', this.token);
        location.reload();
      }
    
      // this.loading = result.loading;
      // this.error = result.error;
      console.log(result);
    });
  }
  ngOnDestroy(){
    console.log();
    localStorage.setItem('authenticating', "false");
  }
}


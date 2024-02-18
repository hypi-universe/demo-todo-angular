import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  mismatch:boolean = false;
  signInObj: any = {
    "username": "",
    "password": ""
  };
  newPassword:string = "";
  register:string = "Sign Up";
  token:string = "";
  constructor( private apollo: Apollo, private router: Router){}

  ngOnInit(): void {
    localStorage.setItem('authenticating', "true");
  }

  ngOnDestroy(){
    localStorage.setItem('authenticating', "false");
  }
  Register(){
    this.register = "Registering";
    this.apollo.mutate({
      mutation: gql`
      mutation {
        createAccount(
            value: {
                username: "${this.signInObj.username}",
                password: { value: "${this.signInObj.password}" }
            }
            ) {
                id
                created
                createdBy
            }
       }
      `
    }).subscribe((result: any) => {
      console.log(result);
      this.apollo
    .watchQuery({
      query: gql`
      {
        login(
          username: "${this.signInObj.username}",
          password: "${this.signInObj.password}"
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
        this.register = "Failed retry";
      }
      else{
        localStorage.setItem('token', this.token);
        location.reload();
      }
    
      // this.loading = result.loading;
      // this.error = result.error;
      console.log(result);
    });
    console.log("routing");
    });
  }
}

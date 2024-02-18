import { Component, OnInit, inject } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { FooterComponent } from './footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
// import { BrowserModule } from '@angular/platform-browser';
import { GraphQLModule } from './graphql.module';
import { Apollo, gql, ApolloModule } from 'apollo-angular';
import { TodosService } from './todos.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
 loggedIn:boolean = false;
 unregistered:boolean = false;
 authenticated:boolean = false;
 token:string | null;

 constructor(){
  this.token = localStorage.getItem('token') || null;
 }

 ngOnInit(): void {
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
  console.log(`the token${this.token}`);
  if (this.token != null && this.token != undefined && this.token.toString() != "null"){
    this.authenticated = true;
  }
  else{
    console.log(`entered else`);
    this.authenticated = false;
  }
 }

 onRegister(){
  this.unregistered = true;
  this.loggedIn = false;
 }
 onLogin(){
  this.loggedIn = false;
  this.unregistered = false;
 }

}

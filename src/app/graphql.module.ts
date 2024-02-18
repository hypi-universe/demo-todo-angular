import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
const uri = 'https://api.hypi.app/graphql/';
const tokenFromDeveloperHub = 'myToken';
export function provideApollo(httpLink: HttpLink): any {
  /* Get the authentication token from local storage if it exists or
   * generate one by login a user into their account or
   * the current one can be copied from the Developer Hub"
  */
  const token = localStorage.getItem('token') ? localStorage.getItem('token') : tokenFromDeveloperHub;
  const auth = setContext((operation, context) => (localStorage.getItem('token') ? {
    headers: {
      "authorization" : `${token}`,        
      "hypi-domain": "theorising-romance.apps.hypi.app"
      },
  }:{
    headers: {
        "hypi-domain": "theorising-romance.apps.hypi.app"
      },
  }));
  const link = ApolloLink.from([auth, httpLink.create({uri, withCredentials: true})]);
  const cache = new InMemoryCache();
  return {
    link,
    cache
  };
}
@NgModule({
  exports: [
    HttpClientModule,
  ],
  providers: [{
    provide: APOLLO_OPTIONS,
    useFactory: provideApollo,
    deps: [HttpLink]
  }]
})
export class GraphQLModule {
}
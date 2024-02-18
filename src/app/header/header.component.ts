import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodosService } from '../todos.service';
import { Apollo, gql } from 'apollo-angular';

@Component({
  standalone: true,
  selector: 'app-todo-header',
  imports: [FormsModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private todosService = inject(TodosService);

  title = '';

  constructor(private apollo: Apollo,
    ) {
  }

  addTodo() {
    if (this.title) {
      this.todosService.addItem(this.title);
      this.onAddTodo(this.title)
      this.apollo
    .watchQuery({
      query: gql`
      {
        find(type: TodoItem, arcql: "*") {
          edges {
            node {
              ... on TodoItem {
                hypi{
                  id
                  instanceId
                  updated
                  created
                  trashed
                }
                title
                completed
              }
            }
            cursor
          }
        }
      }      
      `,
      fetchPolicy: 'network-only'
    })
    .valueChanges.subscribe((result: any) => {
      this.todosService.deserializeItem(result?.data?.find.edges ?? [])
      console.log(result);
    });
      // Reset title to clear input field.
      this.title = '';
    }
  }

  onAddTodo(title: string) {
    this.apollo.mutate({
      mutation: gql`
      mutation Upsert($values: HypiUpsertInputUnion!) {
        upsert(values: $values) {
          id
        }
      }
      `,
      variables: {
      values: {
        TodoItem: [
          {
            title: title,
            completed:  false,
          }
        ]
      }
    }
    }).subscribe((result: any) => {
      console.log(result);
    });
  }
}

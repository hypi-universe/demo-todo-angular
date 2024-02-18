import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { Todo, TodosService } from '../todos.service';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { Apollo, gql, ApolloModule } from 'apollo-angular';

@Component({
    selector: 'app-todo-list',
    standalone: true,
    imports: [TodoItemComponent],
    templateUrl: './todo-list.component.html',
})
export class TodoListComponent {
  private location = inject(Location);
  profiles: any[] = [];
  loading = true;
  error: any;

  constructor(private apollo: Apollo, private todosService:TodosService) {
  }

  ngOnInit() {
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
      this.profiles = result?.data?.find.edges;
      this.loading = result.loading;
      this.error = result.error;
      console.log(result);
    });
  }

  get todos(): Todo[] {
    const filter = this.location.path().split('/')[1] || 'all';
    return this.todosService.getItems(filter);
  }

  get activeTodos(): Todo[] {
    return this.todosService.getItems('active');
  }

  removeTodo(todo: Todo): void {
    this.todosService.removeItem(todo);
  }

  toggleAll(e: Event) {
    const input = e.target as HTMLInputElement;
    this.todosService.toggleAll(input.checked);
  }
}

import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Todo } from '../todos.service';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './todo-item.component.html',
})
export class TodoItemComponent implements AfterViewChecked {
  @Input({required: true}) todo!: Todo;

  @Output() remove = new EventEmitter<Todo>();

  @ViewChild('todoInputRef') inputRef?: ElementRef;

  constructor(private apollo: Apollo,
    ) {
  }

  title = '';

  isEditing = false;

  toggleTodo(): void {
    this.todo.completed = !this.todo.completed;
    console.log(this.todo.hypi?.id);
    this.onUpdateTodo(this.todo.hypi?.id, this.todo.title, this.todo.completed)
  }

  removeTodo(): void {
    this.remove.emit(this.todo);
    this.onDeleteTodo(this.todo.hypi?.id);
  }

  startEdit() {
    this.isEditing = true;
  }

  handleBlur(e: Event) {
    this.isEditing = false;
  }

  handleFocus(e: Event) {
    this.title = this.todo.title;
  }

  updateTodo() {
    if (!this.title) {
      this.remove.emit(this.todo);
      this.onDeleteTodo(this.todo.hypi?.id);
    } else {
      this.todo.title = this.title;
      this.onUpdateTodo(this.todo.hypi?.id, this.todo.title, this.todo.completed);
    }

    this.isEditing = false;
  }

  ngAfterViewChecked(): void {
    if (this.isEditing) {
      this.inputRef?.nativeElement.focus();
    }
  }

  onUpdateTodo(id:string | undefined, title:string, completed:boolean):void {
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
            hypi:{
              id: id
            },
            title: title,
            completed:  completed,
          }
        ]
      }
    }
    }).subscribe((result: any) => {
      console.log(result);
    });
  }

  onDeleteTodo(id:string | undefined,){
    this.apollo.mutate({
      mutation: gql`
      mutation {
        delete(type: TodoItem, arcql: "hypi.id = '${id}'")
      }
      `
    }).subscribe((result: any) => {
      console.log(result);
    });
  }
}

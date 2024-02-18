import { Injectable } from '@angular/core';

export interface Hypi{
  id: string;
  createdBy: string;
  created: Date;
  updated: Date;
  trashed?: Date;
  instanceId: string;
}

export interface Todo {
  hypi?: Hypi;
  title: string;
  completed: boolean;
}

@Injectable({ providedIn: 'root' })
export class TodosService {
    todos: Todo[] = [];

    addItem(title: string): void {
      const todo: Todo = {
        title,
        completed: false,
      };
      this.todos.push(todo);
    }

    deserializeItem(itemList: Array<any>): void {
      let tempTodos: Todo[] = [];
      itemList.forEach((item)=> {
         console.log(item.node.hypi.id,)
        const todo: Todo = {
          hypi:{
            id: item.node.hypi.id,
            createdBy: item.node.hypi.createdBy,
            created: item.node.hypi.created,
            updated: item.node.hypi.updated,
            trashed: item.node.hypi.trashed,
            instanceId: item.node.hypi.instanceId
          },
          title: item.node.title ?? "null",
          completed: item.node.completed ?? false,
        };
        tempTodos.push(todo);
        this.todos = tempTodos;
      });
    }

    removeItem(todo: Todo): void {
      const index = this.todos.indexOf(todo);
      this.todos.splice(index, 1);
    }

    clearCompleted(): void {
      this.todos = this.todos.filter((todo) => !todo.completed);
    }

    toggleAll(completed: boolean): void {
      this.todos = this.todos.map((todo) => ({ ...todo, completed }));
    }

    getItems(type = 'all'): Todo[] {
      switch (type) {
        case 'active':
          return this.todos.filter((todo) => !todo.completed);
        case 'completed':
          return this.todos.filter((todo) => todo.completed);
      }

      return this.todos;
    }
}

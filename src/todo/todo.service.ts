import { Injectable, NotFoundException } from '@nestjs/common';
import { find } from 'rxjs';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {

  private todos: Todo[] = [
    {
      id: 0,
      description: "Piedra del Alma",
      done: false,
    },
    {
      id: 1,
      description: "Piedra del Tiempo",
      done: false,
    },
    {
      id: 2,
      description: "Piedra del Espacio",
      done: false,
    },
  ];


  create({description}: CreateTodoDto): Todo {
    const todo = new Todo();

    todo.id = Math.max(...this.todos.map(todo => todo.id), 0) + 1;
    todo.description = description;

    this.todos.push(todo);
    
    return todo;
  }

  findAll(): Todo[] {
    return this.todos;
  }

  findOne(id: number): Todo {
    const todoById = this.todos.find(a => a.id === id);

    if(!todoById) throw new NotFoundException(`TODO with id ${id} not found`);

    return this.todos[id];
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {

    const {description,done} = updateTodoDto;
    
    const todo = this.findOne(id);

    if(done !== undefined) todo.done = done;

    if(description) todo.description = description;

    this.todos = this.todos.map(dbTodo => {
      if(dbTodo.id === id) return todo;

      return dbTodo;
    })

    return todo;
  }

  remove(id: number): Todo {

    const todoToDelete = this.todos.find(todo => todo.id === id);

    if(!todoToDelete) throw new NotFoundException(`todo with id: ${id} not found`);

    this.todos = this.todos.filter(todo => todo.id !== id);

    return todoToDelete;
  }
}
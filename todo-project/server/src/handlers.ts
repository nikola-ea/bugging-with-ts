import { Todo, CreateTodo } from "../../shared/types";
import { StatusResponse, TypedRouter } from "../../shared/typed-router";
import crypto from "crypto";

const todos: Todo[] = [
  { id: "1", title: "Learn TypeScript", completed: false },
  { id: "2", title: "Build todo app", completed: false },
];

const handlers = {
  // GET /todos
  getTodos: () => {
    return {
      status: 200,
      body: todos,
    } satisfies StatusResponse<Todo[]>;
  },

  // POST /todos
  createTodo: (data: CreateTodo) => {
    if (typeof data.title !== "string" || !data.title.trim()) {
      return {
        status: 400,
        body: { error: "`title` is required" },
      } satisfies StatusResponse<{ error: string }>;
    }

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: data.title.trim(),
      completed: false,
    };

    todos.push(newTodo);

    return {
      status: 201,
      body: newTodo,
    } satisfies StatusResponse<Todo>;
  },

  // PATCH /todos/:id
  toggleTodo: (data: { id: string; completed: boolean }) => {
    const todo = todos.find((t) => t.id === data.id);

    if (!todo) {
      return {
        status: 404,
        body: { error: "Todo not found" },
      } satisfies StatusResponse<{ error: string }>;
    }

    todo.completed = data.completed;

    return {
      status: 200,
      body: todo,
    } satisfies StatusResponse<Todo>;
  },

  // DELETE /todos/:id
  deleteTodo: (id: string) => {
    const index = todos.findIndex((t) => t.id === id);
    if (index === -1) {
      return {
        status: 404,
        body: { error: "Todo not found" },
      } satisfies StatusResponse<{ error: string }>;
    }

    const [deleted] = todos.splice(index, 1);

    return {
      status: 200,
      body: deleted,
    } satisfies StatusResponse<Todo>;
  },
};

export const router = new TypedRouter(handlers);
export type TodoHandlers = typeof handlers;

import express, { Request, Response } from "express";
import cors from "cors";
import type { Todo, CreateTodo } from "../../shared/types";
import crypto from "crypto";

const app = express();
const port = 3000;

app.use(cors()); // <--- Enable CORS for all origins
app.use(express.json());

const todos: Todo[] = [
  { id: "1", title: "Learn TypeScript", completed: false },
  { id: "2", title: "Build todo app", completed: false },
];

app.get("/todos", (_req: Request, res: Response<Todo[]>) => {
  res.json(todos);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

app.patch(
  "/todos/:id",
  (req: Request, res: Response<Todo | { error: string }>) => {
    const { id } = req.params;
    const { completed } = req.body;

    if (typeof completed !== "boolean") {
      return res.status(400).json({ error: "`completed` boolean is required" });
    }

    const todo = todos.find((t) => t.id === id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    todo.completed = completed;
    res.json(todo);
  }
);

app.post("/todos", (req, res) => {
  const { title } = req.body as CreateTodo;

  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }

  const newTodo: Todo = {
    id: crypto.randomUUID(),
    title: title.trim(),
    completed: false,
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }
  todos.splice(index, 1);
  res.status(204).send(); // No Content
});

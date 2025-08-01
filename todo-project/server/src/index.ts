import express, { Request, Response } from "express";
import cors from "cors";
import type { Todo, CreateTodo } from "../../shared/types";
import { router } from "./handlers";
import crypto from "crypto";

const app = express();
const port = 3000;

app.use(cors()); // <--- Enable CORS for all origins
app.use(express.json());

const handlers = router.getHandlers();

app.get("/todos", async (req, res) => {
  const result = await handlers.getTodos();
  res.status(result.status).json(result.body);
});

app.post("/todos", async (req, res) => {
  const result = await handlers.createTodo(req.body);
  res.status(result.status).json(result.body);
});

app.patch("/todos/:id", async (req, res) => {
  const result = await handlers.toggleTodo({
    id: req.params.id,
    completed: req.body.completed,
  });
  res.status(result.status).json(result.body);
});

app.delete("/todos/:id", async (req, res) => {
  const result = await handlers.deleteTodo(req.params.id);
  res.status(result.status).json(result.body);
});

app.listen(3000, () => {
  console.log("🚀 Server is running on http://localhost:3000");
});

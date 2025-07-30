import { Hono } from "hono";

import itemRouter from "./route/item.route";

const app = new Hono();

app.route("/items", itemRouter);

export default app;
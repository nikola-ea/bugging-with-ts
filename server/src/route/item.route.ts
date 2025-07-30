import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { CreateItemSchema, UpdateItemSchema } from "../schema/item.schema";
import { createItemHandler, getAllItemsHandler, updateItemHandler, deleteItemHandler } from "../handler/item.handler";

const itemRouter = new Hono();

itemRouter.post("/", zValidator("json", CreateItemSchema), createItemHandler);
itemRouter.get("/", getAllItemsHandler);
itemRouter.put("/:id", zValidator("json", UpdateItemSchema), updateItemHandler);
itemRouter.delete("/:id", deleteItemHandler);

export default itemRouter;
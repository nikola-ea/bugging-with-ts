import { Context } from "hono";
import { zValidator } from "@hono/zod-validator";
import { CreateItemSchema, Item, UpdateItemSchema } from "../schema/item.schema";
import { ItemModel } from "../model/item.model";

export const createItemHandler = async (c: Context) => {
    const body = await c.req.json();
    const parsed = CreateItemSchema.safeParse(body);
    console.log(parsed);
    if (!parsed.success) {
        return c.json({ error: parsed.error.message }, 400);
    }
    const item = ItemModel.create(parsed.data);
    return c.json(item, 201);
};

export const getAllItemsHandler = async (c: Context) => {
    const items = ItemModel.getAll();
    return c.json(items);
};

export const updateItemHandler = async (c: Context) => {
    const { id } = c.req.param();
    const body = await c.req.json();
    const parsed = UpdateItemSchema.safeParse(body);
    if (!parsed.success) {
        return c.json({ error: parsed.error.message }, 400);
    }
    const updated = ItemModel.update(id, parsed.data.quantity);
    if (!updated) return c.notFound();
    return c.json(updated);
};  

export const deleteItemHandler = async (c: Context) => {
    const { id } = c.req.param();
    const deleted = ItemModel.delete(id);
    return deleted ? c.json({ message: "Item deleted" }) : c.notFound();
};


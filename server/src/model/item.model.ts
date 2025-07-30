import { Item } from "../schema/item.schema";
import { randomUUID } from "crypto";

const items: Item[] = [];

export const ItemModel = {
    getAll(): Item[] {
        return items;
    }, 

    create(data: Omit<Item, "id" | "lastUpdated">): Item {
        const newItem: Item = {
            id: randomUUID(),
            ...data,
            lastUpdated: new Date()
        };
        items.push(newItem);
        return newItem;
    },

    update(id: string, quantity: number): Item | undefined {
        const item = items.find((i) => i.id === id);
        if (!item) return undefined;

        item.quantity = quantity;
        item.lastUpdated = new Date();
        return item;
    },

    delete(id: string): boolean {
        const index = items.findIndex((i) => i.id === id);
        if (index === -1) return false;

        items.splice(index, 1);
        return true;
    }
};
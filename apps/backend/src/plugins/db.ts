import { Elysia } from "elysia";
import { db } from "../db/index.ts";

export const dbPlugin = new Elysia({ name: "db-plugin" }).decorate("db", db);

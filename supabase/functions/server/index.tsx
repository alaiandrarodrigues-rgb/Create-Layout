import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();
const prefix = "/make-server-f837f178";

app.use("*", logger(console.log));

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

app.get(`${prefix}/health`, (c) => {
  return c.json({ status: "ok" });
});

// Listar todas as faturas
app.get(`${prefix}/invoices`, async (c) => {
  try {
    const invoices = await kv.getByPrefix("invoice:");
    return c.json({ invoices });
  } catch (error) {
    console.error(error);
    return c.json({ error: "Erro ao listar faturas" }, 500);
  }
});

// Buscar uma fatura
app.get(`${prefix}/invoices/:id`, async (c) => {
  try {
    const invoice = await kv.get(`invoice:${c.req.param("id")}`);

    if (!invoice) {
      return c.json({ error: "Fatura não encontrada" }, 404);
    }

    return c.json({ invoice });
  } catch (error) {
    console.error(error);
    return c.json({ error: "Erro ao buscar fatura" }, 500);
  }
});

// Criar uma fatura
app.post(`${prefix}/invoices`, async (c) => {
  try {
    const body = await c.req.json();
    const { name, value, dueDate, status, category } = body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof value !== "number" ||
      !Number.isFinite(value) ||
      value < 0 ||
      typeof dueDate !== "string" ||
      !["paid", "pending", "overdue"].includes(status)
    ) {
      return c.json({ error: "Dados da fatura inválidos" }, 400);
    }

    const id = crypto.randomUUID();
    const invoice = {
      id,
      name: name.trim(),
      value,
      dueDate,
      status,
      ...(typeof category === "string" ? { category } : {}),
    };

    await kv.set(`invoice:${id}`, invoice);

    return c.json({ invoice }, 201);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Erro ao criar fatura" }, 500);
  }
});

// Atualizar uma fatura
app.put(`${prefix}/invoices/:id`, async (c) => {
  try {
    const id = c.req.param("id");
    const current = await kv.get(`invoice:${id}`);

    if (!current) {
      return c.json({ error: "Fatura não encontrada" }, 404);
    }

    const body = await c.req.json();
    const updated = {
      ...current,
      ...body,
      id,
    };

    if (
      typeof updated.name !== "string" ||
      !updated.name.trim() ||
      typeof updated.value !== "number" ||
      !Number.isFinite(updated.value) ||
      updated.value < 0 ||
      typeof updated.dueDate !== "string" ||
      !["paid", "pending", "overdue"].includes(updated.status)
    ) {
      return c.json({ error: "Dados da fatura inválidos" }, 400);
    }

    updated.name = updated.name.trim();
    await kv.set(`invoice:${id}`, updated);

    return c.json({ invoice: updated });
  } catch (error) {
    console.error(error);
    return c.json({ error: "Erro ao atualizar fatura" }, 500);
  }
});

// Excluir uma fatura
app.delete(`${prefix}/invoices/:id`, async (c) => {
  try {
    const id = c.req.param("id");
    const invoice = await kv.get(`invoice:${id}`);

    if (!invoice) {
      return c.json({ error: "Fatura não encontrada" }, 404);
    }

    await kv.del(`invoice:${id}`);

    return c.json({ message: "Fatura excluída com sucesso" });
  } catch (error) {
    console.error(error);
    return c.json({ error: "Erro ao excluir fatura" }, 500);
  }
});

Deno.serve(app.fetch);

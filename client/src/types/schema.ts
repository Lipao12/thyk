import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Categories schema
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull(), // Color code as string (hex or HSL)
  userId: integer("user_id").references(() => users.id).notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  color: true,
  userId: true,
});

// Tasks schema
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  completed: boolean("completed").default(false).notNull(),
  priority: text("priority").default("medium").notNull(), // low, medium, high
  categoryId: integer("category_id").references(() => categories.id),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
  categories: many(categories),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  user: one(users, {
    fields: [categories.userId],
    references: [users.id],
  }),
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [tasks.categoryId],
    references: [categories.id],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

// Custom types for frontend use
export type TaskWithCategory = Task & {
  category?: Category;
};

// Enums
export enum Priority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high"
}

export enum TimeFrame {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly"
}

import { pgTable, uuid, text, timestamp, boolean, numeric, pgEnum, index, uniqueIndex } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Enums
export const movementTypeEnum = pgEnum('movement_type', [
  'po_receive',
  'adjustment_in',
  'adjustment_out',
  'so_issue',
  'transfer_in',
  'transfer_out'
])

// Tables
export const appRoles = pgTable('app_roles', {
  key: text('key').primaryKey(),
  description: text('description').notNull(),
})

export const organizations = pgTable('organizations', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  created_at: timestamp('created_at').defaultNow().notNull(),
})

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  clerk_user_id: text('clerk_user_id').notNull().unique(),
  email: text('email').notNull(),
  display_name: text('display_name'),
  dark_mode: boolean('dark_mode').default(false).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
})

export const memberships = pgTable('memberships', {
  org_id: uuid('org_id').notNull().references(() => organizations.id),
  user_id: uuid('user_id').notNull().references(() => users.id),
  role_key: text('role_key').notNull().references(() => appRoles.key),
}, (table) => ({
  pk: uniqueIndex('memberships_pk').on(table.org_id, table.user_id),
}))

export const invitations = pgTable('invitations', {
  id: uuid('id').defaultRandom().primaryKey(),
  org_id: uuid('org_id').notNull().references(() => organizations.id),
  email: text('email').notNull(),
  role_key: text('role_key').notNull().references(() => appRoles.key),
  invite_code: text('invite_code').notNull().unique(),
  used_at: timestamp('used_at'),
  created_at: timestamp('created_at').defaultNow().notNull(),
})

export const items = pgTable('items', {
  id: uuid('id').defaultRandom().primaryKey(),
  sku: text('sku').notNull().unique(),
  description: text('description').notNull(),
  uom: text('uom').default('ea').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
})

export const warehouses = pgTable('warehouses', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
})

export const bins = pgTable('bins', {
  id: uuid('id').defaultRandom().primaryKey(),
  warehouse_id: uuid('warehouse_id').notNull().references(() => warehouses.id),
  code: text('code').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  warehouse_bin_unique: uniqueIndex('warehouse_bin_unique').on(table.warehouse_id, table.code),
}))

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
})

export const movements = pgTable('movements', {
  id: uuid('id').defaultRandom().primaryKey(),
  item_id: uuid('item_id').notNull().references(() => items.id),
  warehouse_id: uuid('warehouse_id').notNull().references(() => warehouses.id),
  bin_id: uuid('bin_id').references(() => bins.id),
  project_id: uuid('project_id').references(() => projects.id),
  qty: numeric('qty', { precision: 18, scale: 6 }).notNull(),
  unit_cost: numeric('unit_cost', { precision: 18, scale: 6 }),
  mtype: movementTypeEnum('mtype').notNull(),
  ref: text('ref'),
  moved_at: timestamp('moved_at').defaultNow().notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
})

// Indexes for performance
export const movementsItemIdx = index('movements_item_idx').on(movements.item_id)
export const movementsWarehouseIdx = index('movements_warehouse_idx').on(movements.warehouse_id)
export const movementsProjectIdx = index('movements_project_idx').on(movements.project_id)
export const movementsDateIdx = index('movements_date_idx').on(movements.moved_at)

// Relations
export const organizationsRelations = relations(organizations, ({ many }) => ({
  memberships: many(memberships),
  invitations: many(invitations),
}))

export const usersRelations = relations(users, ({ many }) => ({
  memberships: many(memberships),
}))

export const appRolesRelations = relations(appRoles, ({ many }) => ({
  memberships: many(memberships),
  invitations: many(invitations),
}))

export const membershipsRelations = relations(memberships, ({ one }) => ({
  organization: one(organizations, {
    fields: [memberships.org_id],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [memberships.user_id],
    references: [users.id],
  }),
  role: one(appRoles, {
    fields: [memberships.role_key],
    references: [appRoles.key],
  }),
}))

export const itemsRelations = relations(items, ({ many }) => ({
  movements: many(movements),
}))

export const warehousesRelations = relations(warehouses, ({ many }) => ({
  bins: many(bins),
  movements: many(movements),
}))

export const binsRelations = relations(bins, ({ one, many }) => ({
  warehouse: one(warehouses, {
    fields: [bins.warehouse_id],
    references: [warehouses.id],
  }),
  movements: many(movements),
}))

export const projectsRelations = relations(projects, ({ many }) => ({
  movements: many(movements),
}))

export const movementsRelations = relations(movements, ({ one }) => ({
  item: one(items, {
    fields: [movements.item_id],
    references: [items.id],
  }),
  warehouse: one(warehouses, {
    fields: [movements.warehouse_id],
    references: [warehouses.id],
  }),
  bin: one(bins, {
    fields: [movements.bin_id],
    references: [bins.id],
  }),
  project: one(projects, {
    fields: [movements.project_id],
    references: [projects.id],
  }),
}))

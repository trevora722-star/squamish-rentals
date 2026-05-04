import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
  date,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "hold",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
  "refunded",
]);

export const skillLevelEnum = pgEnum("skill_level", [
  "beginner",
  "intermediate",
  "advanced",
]);

export const messageRoleEnum = pgEnum("message_role", [
  "user",
  "assistant",
  "tool",
  "system",
]);

export const atvs = pgTable(
  "atvs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 64 }).notNull(),
    name: varchar("name", { length: 128 }).notNull(),
    make: varchar("make", { length: 64 }).notNull(),
    model: varchar("model", { length: 64 }).notNull(),
    year: integer("year").notNull(),
    engineCc: integer("engine_cc"),
    seats: integer("seats").notNull().default(1),
    skillLevel: skillLevelEnum("skill_level").notNull().default("beginner"),
    description: text("description"),
    highlights: jsonb("highlights").$type<string[]>().default([]),
    imageUrl: text("image_url"),
    galleryUrls: jsonb("gallery_urls").$type<string[]>().default([]),
    dailyRate: decimal("daily_rate", { precision: 10, scale: 2 }).notNull(),
    weeklyRate: decimal("weekly_rate", { precision: 10, scale: 2 }),
    depositAmount: decimal("deposit_amount", { precision: 10, scale: 2 }).notNull(),
    minAge: integer("min_age").notNull().default(19),
    requiresLicense: boolean("requires_license").notNull().default(true),
    quantityOwned: integer("quantity_owned").notNull().default(1),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("atvs_slug_unique").on(t.slug)],
);

export const addons = pgTable(
  "addons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 64 }).notNull(),
    name: varchar("name", { length: 128 }).notNull(),
    description: text("description"),
    pricePerDay: decimal("price_per_day", { precision: 10, scale: 2 }).notNull(),
    flatFee: decimal("flat_fee", { precision: 10, scale: 2 }),
    active: boolean("active").notNull().default(true),
  },
  (t) => [uniqueIndex("addons_slug_unique").on(t.slug)],
);

export const deliveryZones = pgTable("delivery_zones", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 128 }).notNull(),
  description: text("description"),
  baseFee: decimal("base_fee", { precision: 10, scale: 2 }).notNull(),
  perKmFee: decimal("per_km_fee", { precision: 10, scale: 2 }).notNull().default("0"),
  maxDistanceKm: integer("max_distance_km"),
  coverage: jsonb("coverage").$type<{
    type: "postal_prefix" | "city" | "radius";
    values?: string[];
    centerLat?: number;
    centerLng?: number;
    radiusKm?: number;
  }>(),
  active: boolean("active").notNull().default(true),
});

export const customers = pgTable(
  "customers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull(),
    name: varchar("name", { length: 128 }).notNull(),
    phone: varchar("phone", { length: 32 }),
    dob: date("dob"),
    driverLicenseNumber: varchar("driver_license_number", { length: 64 }),
    driverLicenseProvince: varchar("driver_license_province", { length: 8 }),
    addressLine1: text("address_line1"),
    addressLine2: text("address_line2"),
    city: varchar("city", { length: 64 }),
    province: varchar("province", { length: 8 }),
    postalCode: varchar("postal_code", { length: 16 }),
    country: varchar("country", { length: 2 }).default("CA"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("customers_email_unique").on(t.email)],
);

export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bookingNumber: varchar("booking_number", { length: 16 }).notNull(),
    customerId: uuid("customer_id").references(() => customers.id),
    status: bookingStatusEnum("status").notNull().default("pending"),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    deliveryAddress: text("delivery_address").notNull(),
    deliveryZoneId: uuid("delivery_zone_id").references(() => deliveryZones.id),
    deliveryWindow: varchar("delivery_window", { length: 64 }),
    deliveryNotes: text("delivery_notes"),
    deliveryFee: decimal("delivery_fee", { precision: 10, scale: 2 }).notNull().default("0"),
    atvSubtotal: decimal("atv_subtotal", { precision: 10, scale: 2 }).notNull(),
    addonsSubtotal: decimal("addons_subtotal", { precision: 10, scale: 2 }).notNull().default("0"),
    taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).notNull().default("0"),
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
    depositTotal: decimal("deposit_total", { precision: 10, scale: 2 }).notNull().default("0"),
    stripeSessionId: varchar("stripe_session_id", { length: 128 }),
    stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 128 }),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    waiverSignedAt: timestamp("waiver_signed_at", { withTimezone: true }),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
    notes: text("notes"),
    chatSessionId: uuid("chat_session_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("bookings_number_unique").on(t.bookingNumber),
    index("bookings_status_idx").on(t.status),
    index("bookings_date_idx").on(t.startDate, t.endDate),
    index("bookings_customer_idx").on(t.customerId),
  ],
);

export const bookingItems = pgTable("booking_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id")
    .notNull()
    .references(() => bookings.id, { onDelete: "cascade" }),
  atvId: uuid("atv_id").notNull().references(() => atvs.id),
  quantity: integer("quantity").notNull().default(1),
  unitRate: decimal("unit_rate", { precision: 10, scale: 2 }).notNull(),
  numDays: integer("num_days").notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
});

export const bookingAddons = pgTable("booking_addons", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id")
    .notNull()
    .references(() => bookings.id, { onDelete: "cascade" }),
  addonId: uuid("addon_id").notNull().references(() => addons.id),
  quantity: integer("quantity").notNull().default(1),
  unitPricePerDay: decimal("unit_price_per_day", { precision: 10, scale: 2 }).notNull(),
  numDays: integer("num_days").notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
});

export const bookingHolds = pgTable(
  "booking_holds",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    atvId: uuid("atv_id")
      .notNull()
      .references(() => atvs.id, { onDelete: "cascade" }),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    quantity: integer("quantity").notNull().default(1),
    bookingId: uuid("booking_id").references(() => bookings.id, { onDelete: "cascade" }),
    sessionToken: varchar("session_token", { length: 64 }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("holds_atv_date_idx").on(t.atvId, t.startDate, t.endDate),
    index("holds_expires_idx").on(t.expiresAt),
  ],
);

export const waivers = pgTable("waivers", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id")
    .notNull()
    .references(() => bookings.id, { onDelete: "cascade" }),
  customerId: uuid("customer_id").notNull().references(() => customers.id),
  version: varchar("version", { length: 16 }).notNull(),
  signedAt: timestamp("signed_at", { withTimezone: true }).notNull().defaultNow(),
  signatureData: text("signature_data"),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
});

export const chatSessions = pgTable("chat_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id").references(() => customers.id),
  contactName: varchar("contact_name", { length: 128 }),
  contactEmail: varchar("contact_email", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 32 }),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  lastMessageAt: timestamp("last_message_at", { withTimezone: true }).notNull().defaultNow(),
  status: varchar("status", { length: 32 }).notNull().default("active"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
});

export const chatMessages = pgTable(
  "chat_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => chatSessions.id, { onDelete: "cascade" }),
    role: messageRoleEnum("role").notNull(),
    content: jsonb("content").notNull(),
    toolUseId: varchar("tool_use_id", { length: 64 }),
    toolName: varchar("tool_name", { length: 64 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("chat_messages_session_idx").on(t.sessionId, t.createdAt)],
);

export const kbArticles = pgTable(
  "kb_articles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 96 }).notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    category: varchar("category", { length: 64 }),
    body: text("body").notNull(),
    tags: jsonb("tags").$type<string[]>().default([]),
    published: boolean("published").notNull().default(true),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("kb_articles_slug_unique").on(t.slug)],
);

export type Atv = typeof atvs.$inferSelect;
export type NewAtv = typeof atvs.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type Customer = typeof customers.$inferSelect;
export type ChatSession = typeof chatSessions.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;

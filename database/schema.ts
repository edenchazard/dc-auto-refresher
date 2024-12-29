import { sql } from 'drizzle-orm';
import {
  boolean,
  char,
  datetime,
  mediumint,
  mysqlTable,
  varchar,
} from 'drizzle-orm/mysql-core';

export const userTable = mysqlTable(
  'users',
  {
    id: mediumint('id', { unsigned: true }).primaryKey().notNull(),
    username: varchar('username', {
      length: 32,
    }).notNull(),
    role: varchar('role', {
      length: 10,
      enum: ['user', 'owner'],
    })
      .default('user')
      .notNull(),
    registered_on: datetime('registered_on')
      .default(sql`NOW()`)
      .notNull(),
    last_activity: datetime('last_activity'),
    accessToken: char('access_token', {
      length: 129,
    }),
    apiBlocked: boolean('api_blocked').notNull().default(false),
  },
  /* (table) => {
    return {
      last_activityId: index('last_activity_idx').on(table.last_activity),
    };
  }, */
);

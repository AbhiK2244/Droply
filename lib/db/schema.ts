import { pgTable, text, uuid, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";


export const files = pgTable("files", {
    id: uuid("id").defaultRandom().primaryKey(),
    // basic file/folder informations
    name: text("name").notNull(),
    path: text("path").notNull(), // /documents/projects/file.pdf
    size: integer("size").notNull(),
    type: text("type").notNull(), // folder or file type

    //storage informations
    fileUrl: text("file_url").notNull(), // url to access the file in storage
    thumbnailUrl: text("thumbnail_url"),

    // ownership informations
    userId: text("user_id").notNull(), // from clerk
    parentId: uuid("parent_id"), //parent folder id, null if root

    // file/folder flags
    isFolder: boolean("is_folder").notNull().default(false),
    isStarred: boolean("is_starred").notNull().default(false),
    isTrashed: boolean("is_trashed").notNull().default(false),

    // timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})


/*
Parent: Each file/folder can have one parent folder

Children: Each folder can have many child files/folders
*/

export const fileRelations = relations(files, ({one, many}) => ({
    parent: one(files, {
        fields: [files.parentId],
        references: [files.id],
    }),

    // a folder can have many children (files/folders) / relationship to child file/folder
    children: many(files)
}))


// This line creates a TypeScript type named "File" that automatically matches the structure
// of a row from the "files" table. It helps ensure type safety in our code — for example,
// when selecting data from the database using Drizzle ORM, the returned object will always
// have the correct fields and types as defined in the "files" table schema.
export type File = typeof files.$inferSelect;
export type NewFile = typeof files.$inferInsert;
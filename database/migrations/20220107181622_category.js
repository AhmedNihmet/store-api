const defualts = require("../extra/defaultColumns");

exports.up = (knex) =>
  knex.schema.createTable("category", (table) => {
    table.increments("id").primary();
    table.string("name", 150).notNullable().unique();
    table.integer('store_id').notNullable().defaultTo(0);
    table.text("coverpic", ["mediumtext"]);
    defualts(table);
  });

exports.down = (knex) => knex.schema.dropTable("category");
const defualts = require("../extra/defaultColumns");

exports.up = (knex) =>
  knex.schema.createTable("product", (table) => {
    table.increments("id").primary();
    table.string("name", 150).notNullable().unique();
    table.integer('store_id').notNullable().defaultTo(0);
    table.integer('category_id').notNullable().defaultTo(0);
    table.decimal('price' , 11 ,4).notNullable()
    table.string('description' , 350)
    table.text("coverpic", ["mediumtext"]);
    defualts(table);
  });

exports.down = (knex) => knex.schema.dropTable("product");
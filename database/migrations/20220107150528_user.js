const defualts = require("../extra/defaultColumns");

exports.up = (knex) =>
  knex.schema.createTable("user", (table) => {
    table.increments("id").primary();
    table.string("name", 150).notNullable().unique();
    table.string("password", 250).notNullable();
    table.string("salt", 250).notNullable();
    defualts(table);
  });

exports.down = (knex) => knex.schema.dropTable("user");
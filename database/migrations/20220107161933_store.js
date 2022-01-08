const defualts = require("../extra/defaultColumns");

exports.up = (knex) =>
  knex.schema.createTable("store", (table) => {
    table.increments("id").primary();
    table.string("name", 150).notNullable().unique();
    table.text("coverpic", ["mediumtext"]);
    defualts(table);
  });

exports.down = (knex) => knex.schema.dropTable("store");
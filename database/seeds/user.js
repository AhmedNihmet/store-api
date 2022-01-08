exports.seed = (knex) =>
  knex("user")
    .del()
    .then(() =>
      knex("user").insert([
        {
          id: 1,
          name: "Admin",
          salt: "66196324662946573713",
          password: "1e3ec128b55baa376c6fcb3a2835cbcea34f18b1", // password is admin123
          active: 1,
          deleted: 0,
        },
      ])
    );

const filter = require('../helper/data/filter');
const sort = require('../helper/data/sorter');
const db = require('../database/connection');
const sha1 = require('sha1');
const uniqid = require('uniqid');

function readListQuery(limit, offset) {
  return db('user')
    .select()
    .where('user.deleted', 0)
    .andWhere('user.active', 1)
    .limit(limit)
    .offset(offset)
}

function readSingleQuery(id) {
  return db("user")
    .select()
    .where("user.deleted", 0)
    .andWhere("id", id);
}

function readDataGridQuery(pageSize, page, filters, sortArray) {
  const records = db("user")
    .select()
    .where("user.active", 1)
    .andWhere("user.deleted", 0)
    .offset(pageSize * page)
    .limit(pageSize);
  filter(filters, records);
  if (sortArray.length === 0) records.orderBy("id", "desc");
  sort(sortArray, records);

  const recordsCount = db("user")
    .count({ count: "user.id" })
    .where("user.active", 1)
    .andWhere("user.deleted", 0);
  filter(filters, recordsCount);

  return Promise.all([records, recordsCount]).then((result) => {
    const [data, [dataCount]] = result;
    const pages = Math.ceil(dataCount.count / pageSize);
    return {
      data,
      pages,
      records: dataCount.count,
    };
  });
}


module.exports = {
  create: (req) => {
    const { body } = req;
    const generatedSalt = uniqid();

    return db("user").insert({
      name: body.name,
      salt: generatedSalt,
      password: sha1(`${generatedSalt}${body.password}`),
      active: 1,
      created_at: db.fn.now(),
      created_by: req.user.id,
    });
  },
  readListQuery,
  readList: (req) => {
    const query = readListQuery(req.query.limit, req.query.offset);
    if (req.query.q) {
      query.andWhere((builder) => {
        builder.where("name", "LIKE", `%${req.query.q}%`);
      });
    }
    return query;
  },
  readDataGridQuery,
  readDataGrid: (req) => {
    const query = readDataGridQuery(
      req.query.pageSize,
      req.query.page,
      req.query.filtered,
      req.query.sorted
    );
    return query;
  },
  readSingleQuery,
  readSingle: (req) => {
    const query = readSingleQuery(req.params.user_id);
    return query.then(([data]) => data);
  },

  update: (req) => {
    const body = req.body;
    const userId = req.params.user_id;
    let updateObj = {
      name: body.name,
      updated_at: db.fn.now(),
      updated_by: req.user.id,
    };

    if (body.password !== undefined) {
      const generatedSalt = uniqid();
      updateObj.password = sha1(`${generatedSalt}${req.body.password}`);
      updateObj.salt = generatedSalt;
    }

    return db("user")
      .update(updateObj)
      .where("id", userId);
  },

  patch: (req) => {
    const updateOb = {};
    const { body } = req;
    if (body.deleted !== undefined) updateOb.deleted = body.deleted;
    if (body.active !== undefined) updateOb.active = body.active;
    if (Object.entries(body).length === 0 && body.constructor === Object)
      return Promise.resolve(null);
    return db("user")
      .update({ ...updateOb, updated_at: db.fn.now(), updated_by: req.user.id })
      .where("user.id", req.params.user_id)
      .andWhereNot("user.id", req.user.id);
  },
}


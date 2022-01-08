const filter = require('../helper/data/filter');
const sort = require('../helper/data/sorter');
const db = require('../database/connection');

function readListQuery(limit, offset) {
    return db('store')
        .select()
        .where('deleted', 0)
        .andWhere('active', 1)
        .limit(limit).offset(offset)
}

function readSingleQuery(id) {
    return db("store")
        .select()
        .where("deleted", 0)
        .andWhere("id", id);
}

function readDataGridQuery(pageSize, page, filters, sortArray, q) {
    const records = db("store")
        .select()
        .andWhere("deleted", 0)
        .offset(pageSize * page)
        .limit(pageSize);
    filter(filters, records);
    if (sortArray.length === 0) records.orderBy("id", "desc");
    sort(sortArray, records);

    const recordsCount = db("store").count({ count: "id" })
        .where("active", 1)
        .andWhere("deleted", 0);
    filter(filters, recordsCount);

    if (q) {
        records.andWhere((builder) => {
            builder.orWhere("store.id", "LIKE", `%${req.query.q}%`);
            builder.orWhere("store.name", "LIKE", `%${req.query.q}%`);
        });

        recordsCount.andWhere((builder) => {
            builder.orWhere("store.id", "LIKE", `%${req.query.q}%`);
            builder.orWhere("store.name", "LIKE", `%${req.query.q}%`);
        });
    }

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

        return db("store").insert({
            name: body.name,
            coverpic: body.coverpic,
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
                builder.where("id", "LIKE", `%${req.query.q}%`);
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
            req.query.sorted,
            req.query.q
        );
        return query;
    },
    readSingleQuery,
    readSingle: (req) => {
        const query = readSingleQuery(req.params.store_id);
        return query.then(([data]) => data);
    },

    update: (req) => {
        const { body, params } = req;
        return db('store').update({
            name: body.name,
            coverpic: body.coverpic,
            updated_at: db.fn.now(),
            updated_by: req.user.id,
        }).where('id', params.store_id).then(() => params.store_id);
    },

    patch: (req) => {
        const updateOb = {};
        const { body } = req;
        if (body.deleted !== undefined) updateOb.deleted = body.deleted;
        if (body.active !== undefined) updateOb.active = body.active;
        if (Object.entries(body).length === 0 && body.constructor === Object) return Promise.resolve(null);

        return db('store').update(updateOb).where('id', req.params.store_id)
            .then(() => req.params.store_id);
    },
}

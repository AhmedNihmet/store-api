const filter = require('../helper/data/filter');
const sort = require('../helper/data/sorter');
const db = require('../database/connection');

function readListQuery(limit, offset) {
    return db('category')
        .select("category.*", "store.id as sotre_id", "store.name as store_name")
        .leftJoin("store", "store.id", "category.store_id")
        .where('category.deleted', 0)
        .andWhere('category.active', 1)
        .limit(limit).offset(offset)
}

function readSingleQuery(id) {
    return db("category")
        .select("category.*", "store.name as store_name")
        .leftJoin("store", "store.id", "category.store_id")
        .where("category.deleted", 0)
        .andWhere("category.id", id);
}

function readDataGridQuery(pageSize, page, filters, sortArray, q) {
    const records = db("category")
        .select("category.*", "store.id as store_id", "store.name as store_name")
        .leftJoin("store", "store.id", "category.store_id")
        .andWhere("category.deleted", 0)
        .offset(pageSize * page)
        .limit(pageSize);
    filter(filters, records);
    if (sortArray.length === 0) records.orderBy("id", "desc");
    sort(sortArray, records);

    const recordsCount = db("category")
        .count({ count: "category.id" })
        .leftJoin("store", "store.id", "category.store_id")
        .andWhere("category.deleted", 0);
    filter(filters, recordsCount);

    if (q) {
        records.andWhere((builder) => {
            builder.orWhere("category.id", "LIKE", `%${req.query.q}%`);
            builder.orWhere("category.name", "LIKE", `%${req.query.q}%`);
            builder.orWhere("store.name", "LIKE", `%${req.query.q}%`);
            builder.orWhere("store.id", "LIKE", `%${req.query.q}%`);
        });

        recordsCount.andWhere((builder) => {
            builder.orWhere("category.id", "LIKE", `%${req.query.q}%`);
            builder.orWhere("category.name", "LIKE", `%${req.query.q}%`);
            builder.orWhere("store.name", "LIKE", `%${req.query.q}%`);
            builder.orWhere("store.id", "LIKE", `%${req.query.q}%`);
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

        return db("category").insert({
            name: body.name,
            store_id: body.store_id,
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
                builder.orWhere("category.name", "LIKE", `%${req.query.q}%`);
                builder.orWhere("store.name", "LIKE", `%${req.query.q}%`);
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
            req.query.q,
        );
        return query;
    },
    readSingleQuery,
    readSingle: (req) => {
        const query = readSingleQuery(req.params.category_id);
        return query.then(([data]) => data);
    },

    update: (req) => {
        const { body, params } = req;
        return db('category').update({
            name: body.name,
            store_id: body.store_id,
            coverpic: body.coverpic,
            updated_at: db.fn.now(),
            updated_by: req.user.id,
        }).where('id', params.category_id).then(() => params.category_id);
    },

    patch: (req) => {
        const updateOb = {};
        const { body } = req;
        if (body.deleted !== undefined) updateOb.deleted = body.deleted;
        if (body.active !== undefined) updateOb.active = body.active;
        if (Object.entries(body).length === 0 && body.constructor === Object) return Promise.resolve(null);

        return db('category').update(updateOb).where('id', req.params.category_id)
            .then(() => req.params.category_id);
    },
}



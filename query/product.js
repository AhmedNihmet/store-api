const filter = require('../helper/data/filter');
const sort = require('../helper/data/sorter');
const db = require('../database/connection');

function readListQuery(limit, offset) {
    return db('product')
        .select("product.*", "category.name as category_name", "category.id as category_id", "store.name as store_name", "store.id as store_id")
        .leftJoin("category", "category.id", "product.category_id")
        .leftJoin("store", "store.id", "category.store_id")
        .where('product.deleted', 0)
        .andWhere('product.active', 1)
        .limit(limit)
        .offset(offset)
}

function readSingleQuery(id) {
    return db("product")
        .select("product.*", "category.name as category_name", "store.name as store_name")
        .leftJoin("category", "category.id", "product.category_id")
        .leftJoin("store", "store.id", "category.store_id")
        .where("product.deleted", 0)
        .andWhere("product.id", id);
}

function readDataGridQuery(pageSize, page, filters, sortArray) {
    const records = db("product")
        .select("product.*", "category.id as category_id", "category.name as category_name", "store.id as store_id", "store.name as store_name")
        .leftJoin("category", "category.id", "product.category_id")
        .leftJoin("store", "store.id", "category.store_id")
        .andWhere("product.deleted", 0)
        .offset(pageSize * page)
        .limit(pageSize);
    filter(filters, records);
    if (sortArray.length === 0) records.orderBy("id", "desc");
    sort(sortArray, records);

    const recordsCount = db("product")
        .count({ count: "product.id" })
        .leftJoin("category", "category.id", "product.category_id")
        .leftJoin("store", "store.id", "category.store_id")
        .andWhere("product.deleted", 0);
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

        return db("product").insert({
            name: body.name,
            price: body.price,
            description: body.description,
            store_id: body.store_id,
            category_id: body.category_id,
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
        const query = readSingleQuery(req.params.product_id);
        return query.then(([data]) => data);
    },

    update: (req) => {
        const { body, params } = req;
        return db('product').update({
            name: body.name,
            price: body.price,
            description: body.description,
            store_id: body.store_id,
            category_id: body.category_id,
            coverpic: body.coverpic,
            updated_at: db.fn.now(),
            updated_by: req.user.id,
        }).where('id', params.product_id).then(() => params.product_id);
    },

    patch: (req) => {
        const updateOb = {};
        const { body } = req;
        if (body.deleted !== undefined) updateOb.deleted = body.deleted;
        if (body.active !== undefined) updateOb.active = body.active;
        if (Object.entries(body).length === 0 && body.constructor === Object) return Promise.resolve(null);

        return db('product').update(updateOb).where('id', req.params.product_id)
            .then(() => req.params.product_id);
    },
}


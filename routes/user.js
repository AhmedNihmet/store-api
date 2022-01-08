const express = require("express");
const lazyLoad = require("../middleware/validators/common/lazyLoad");
const {UploadSingleBase64} = require('../controller/imageHandler');
const dataGrid = require("../middleware/validators/common/dataGrid");
const withAuth =  require('../controller/withAuth')

const router = express.Router();
const { create, readDataGrid, readList, readSingle , update , patch , PutMe} = require("../query/user");
// const {createValidator , patchValidator , readSinglebranchValidator, updateValidator} = require('../middleware/validators/product')

router.get("/grid", dataGrid, withAuth(readDataGrid));
router.get("/list", lazyLoad, withAuth(readList));
router.post("/", withAuth(create));
router.get("/:user_id", withAuth(readSingle));
router.put('/:user_id'  , withAuth(update))
router.patch('/:user_id'  , withAuth(patch))
router.put("/me", withAuth(PutMe));

module.exports = router;

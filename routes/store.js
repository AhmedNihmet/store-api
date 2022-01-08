const express = require("express");

const lazyLoad = require("../middleware/validators/common/lazyLoad");
const {UploadSingleBase64} = require('../controller/imageHandler');
const dataGrid = require("../middleware/validators/common/dataGrid");
const withAuth =  require('../controller/withAuth')

const router = express.Router();
const { create, readDataGrid, readList, readSingle , update , patch} = require("../query/store");
const {createValidator , patchValidator , readSinglebranchValidator, updateValidator} = require('../middleware/validators/store')

router.get("/grid", dataGrid, withAuth(readDataGrid));
router.get("/list", lazyLoad, withAuth(readList));
router.post("/",createValidator, UploadSingleBase64, withAuth(create));
router.get("/:store_id", readSinglebranchValidator, withAuth(readSingle));
router.put('/:store_id' ,updateValidator, UploadSingleBase64 , withAuth(update))
router.patch('/:store_id' , patchValidator , withAuth(patch))

module.exports = router;

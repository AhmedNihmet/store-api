const express = require("express");
const lazyLoad = require("../middleware/validators/common/lazyLoad");
const {UploadSingleBase64} = require('../controller/imageHandler');
const dataGrid = require("../middleware/validators/common/dataGrid");
const withAuth =  require('../controller/withAuth')

const router = express.Router();
const { create, readDataGrid, readList, readSingle , update , patch} = require("../query/product");
const {createValidator , patchValidator , readSinglebranchValidator, updateValidator} = require('../middleware/validators/product')

router.get("/grid", dataGrid, withAuth(readDataGrid));
router.get("/list", lazyLoad, withAuth(readList));
router.post("/",createValidator, UploadSingleBase64, withAuth(create));
router.get("/:product_id", readSinglebranchValidator, withAuth(readSingle));
router.put('/:product_id' ,updateValidator, UploadSingleBase64 , withAuth(update))
router.patch('/:product_id' , patchValidator , withAuth(patch))

module.exports = router;

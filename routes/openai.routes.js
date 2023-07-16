const  express = require("express");
const router = express.Router();
const ctrl = require("./../controller/openai")


router.post('/openai', ctrl.openai)


module.exports = router;

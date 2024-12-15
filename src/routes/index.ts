import { indexController } from "../controllers";

const express = require("express");
const router = express.Router();

// Home page route.
router.get("/",indexController);


export default router;
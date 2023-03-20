import express from "express";
import xss from "xss-clean";
import cors from "cors";
import helmet  from "helmet";
import bodyParser from "body-parser";
import routes from "../server/routes/index.js";
import upload from 'express-fileupload';

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const imagePath = path.join(__dirname, '../uploads/images')



const app = express();


app.use(xss());
app.use(helmet());
app.use(cors());
app.use(bodyParser.json({ extended: true, limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
app.use(upload({createParentPath : true }))
app.use('/images',express.static(imagePath))


app.get("/arkenea/node/api/health", (req,res)=>{
    res.status(200).send("All Is Well")
})

app.use("/arkenea/node/api/v1", routes);

app.all('*', (req, res) => {
    res.status(400).json({mesage: `can't find the ${req.url} route on server`})
  });

export default app
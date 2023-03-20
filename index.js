import app from "./config/express.js";
import config from "./config/env/index.js";
import ("./server/models/index.js")


app.listen(config.port || 3000,()=>{
    console.log(`listening on port ${config.port || 3000}`);
});

export default app
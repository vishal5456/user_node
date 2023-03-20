import mongoose from "mongoose";
import config from "../../config/env/index.js";


mongoose.connect(config.mongoConnectionUrl,{ useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', function () {
   console.log("Database connected");
  });
  
  // If the connection throws an error
  mongoose.connection.on('error', function (err) {
    console.log(`Database connection lost! ${err.message}`);

  });
  
  // When the connection is disconnected
  mongoose.connection.on('disconnected', function () {
   console.log("Database disconnected");
    
  });
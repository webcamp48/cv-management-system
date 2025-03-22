require("dotenv").config();
import {app} from './app';
import dotenv from "dotenv";
dotenv.config();



// create server
app.listen(process.env.PORT, (error?: Error) => {
  if (error) {
    console.error("Failed to start the server:", error);
  } else {
    console.log(`Server is running on port ${process.env.PORT}`);
  }
});


import express from "express";
import router from './image-processor/router';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(router);

app.listen(PORT, () => {
  console.log("Server started on port 3000");
});

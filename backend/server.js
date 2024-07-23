require("dotenv").config();
const express = require("express");
const cors = require("cors");
const videoRoutes = require("./routes/videoRoutes");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api", videoRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

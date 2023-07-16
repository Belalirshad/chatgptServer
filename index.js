const { config } = require("dotenv");
const  express = require("express");
const cors = require("cors");

const app = express();
config();

app.use(cors())

const PORT = process.env.PORT;

app.use(express.json());
// importing routes

app.use("/api/v1", require("./routes/openai.routes"));
app.listen(PORT, function (err) {
  if (err) {
    console.log(err);
  }
  console.log(`App running on PORT ${PORT}`);
});

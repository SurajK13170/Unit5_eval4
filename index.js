const express = require('express');
const app = express();
require('dotenv').config();
const { Connection } = require('./db');
const { userRoute } = require('./routes/user.route');
const { router } = require('./routes/ip.route');

app.use(express.json());
const port = process.env.PORT || 3000;

app.use('/user', userRoute);
app.use('/ip', router);

app.listen(port, async () => {
  try {
    await Connection;
    console.log('Connected to DB');
  } catch (err) {
    console.error(err);
  }
  console.log(`Server is running at port no.${port}`);
});

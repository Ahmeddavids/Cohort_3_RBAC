const express = require('express')

require('./config/dbconfig')

const userRouter = require("./routers/userRouter")
const app = express();

const port = 4040

app.use(express.json());
app.get('/api/v1', (req, res) => {
    res.send("Welcome to Authentication World")
});

app.use("/api/v1/user", userRouter)

app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`)
})
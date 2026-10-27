const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
app.get("/notifications", (req, res) => {
    const data ={
        jobs: Math.floor(Math.random()*50),
        notifications: Math.floor(Math.random()*140),
        messages: Math.floor(Math.random()*70),
        network: Math.floor(Math.random()*80)
    }
    res.json(data);
});

app.listen(3000, ()=>{
    console.log("server listening on : http://localhost:3000/notifications");
});

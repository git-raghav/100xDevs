// 𝘀𝗶𝗺𝗽𝗹𝗲 𝗛𝗧𝗧𝗣 𝘀𝗲𝗿𝘃𝗲𝗿 𝘂𝘀𝗶𝗻𝗴 𝗡𝗼𝗱𝗲.𝗷𝘀 𝗮𝗻𝗱 𝗘𝘅𝗽𝗿𝗲𝘀𝘀!
const express = require('express');
const app = express();//initialises an instance of express

app.use(express.urlencoded({ extended: true })); //for getting access to body of the incoming request
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/conversations', (req, res) => {
  console.log(req.headers);
  console.log(req.headers.authorization);
  console.log(req.body);
  res.send({
    msg: "2 + 2 = 4"
  })
})

//chatGPT example
app.post('/backend-api/conversation', (req, res) => {
  const message = req.body; //body of the input data send by user from frontend
  const message2 = req.body.message; //text in the "message" attribute in the body of the input data send by user from frontend
  const message3 = req.query.message; //from the url

  // run the ML algo thingy with the input or req/request from user,solve the question asked get the output and return it back as res/response
  console.log(message);
  console.log(message2);
  console.log(message3);
  //console.log(message3);
  res.json({
    output: "the answer to your question is so and so...."
  })
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server listening on port 3000!')
})
//npm install nodemon for downloading nodemon
//npx nodemon index.js for directly running nodemon and not install it

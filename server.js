const path = require('path');
const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const client = require('twilio')(process.env.TWILIOSID, process.env.TWILIOAUTH);
// let io = require("socket.io").listen(5000);
// let socketStream = require("socket.io-stream");
// let speech = require("@google-cloud/speech");
// const client = new speech.SpeechClient();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/', (req, res) => {
  req.sendFile(path.resolve(__dirname, 'public/index.html'));
});

const phoneNumbers = ["firstNumber", "+14807354762"]

app.get("/:phone", (req, res)=>{
  let localnum = req.params.phone == phoneNumbers[0] ? phoneNumbers[1] : phoneNumbers[0];
  client.messages.create({
    body: "Hey someone is interested in you! Go check them out",
    from: "+12817243017",
    to: localnum
  })
  .then(message =>{
    console.log(message);
    res.json({message: "success"});
  })
});
// const encoding = 'LINEAR16';
// const sampleRateHertz = 16000;
// const languageCode = 'en-US';

// const request = {
//   config: {
//     encoding: encoding,
//     sampleRateHertz: sampleRateHertz,
//     languageCode: languageCode
//   }
// };

// const recognizeStream = client.streamingRecognize(request)
//   .on('data', data=>{
//     console.log(data);
//   }).on('error', err=>{
//     console.log("Error: ", err)
//   });
// io.on('connection', (socket)=>{
//   console.log('user connected');
//   socket.on('disconnect', function(){
//     console.log('user disconnected');
//   });

//   socketStream(socket).on('audioStream', stream=>{
//     console.log("are we here");
//     if(stream != null){
//       console.log("not null");
//       stream.pipe(recognizeStream);
//     }
//   });
// });


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

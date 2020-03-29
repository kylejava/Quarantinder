const path = require('path');
const express = require('express');
let io = require("socket.io").listen(5000);
let socketStream = require("socket.io-stream");
let speech = require("@google-cloud/speech");
const client = new speech.SpeechClient();
const credential = require
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/', (req, res) => {
  req.sendFile(path.resolve(__dirname, 'public/index.html'));
});


const encoding = 'LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'en-US';

const request = {
  config: {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode
  }
};

const recognizeStream = client.streamingRecognize(request)
  .on('data', data=>{
    console.log(data);
  }).on('error', err=>{
    console.log("Error: ", err)
  });
io.on('connection', (socket)=>{
  console.log('user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socketStream(socket).on('audioStream', stream=>{
    console.log("are we here");
    if(stream != null){
      console.log("not null");
      stream.pipe(recognizeStream);
    }
  });
});


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

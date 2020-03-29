import * as io from 'socket.io-client';
import * as ss from 'socket.io-stream';
var getUserMedia = require('get-user-media-promise');
var MicrophoneStream = require('microphone-stream');

let socket = io("http://localhost:5000");
socket.emit('connection');

let startRecording = ()=>{
    // var micStream = new MicrophoneStream();
    // var socketstream = ss.createStream();
    // getUserMedia({ video: false, audio: true })
    //     .then(function(stream) {
    //         micStream.setStream(stream);
    //         ss(socket).emit('audioStream', socketstream);
    //         micStream.pipe(socketstream);
    //     }).catch(function(error) {
    //     console.log(error);
    //     });
    const mediaSession = {video: false, audio: true};
    const successCallback = (stream)=>{
        console.log("in callback");
        console.log(stream);
        console.log(stream.getAudioTracks());
        let audioCtx = new AudioContext();
        let source = audioCtx.createMediaStreamSource(stream);
        console.log(source);
        var socketstream = ss.createStream();
        ss(socket).emit('audioStream', socketstream);
        stream.getAudioTracks()[0].pipe(socketstream);
        
    }
    if(navigator.mediaDevices.getUserMedia){
        console.log("exists")
        navigator.mediaDevices.getUserMedia(mediaSession)
         .then(successCallback)
         .catch(err => console.log(err));
     
    }else{
        console.log('User Media not Supported');
    }
}
socket.on('connect', ()=>{
    startRecording();
});
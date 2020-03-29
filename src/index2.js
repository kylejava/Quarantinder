import { connect, createLocalTracks } from 'twilio-video';
import axios from 'axios';

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTS2I4Y2ZkZjIxMjU2Mjc3ZDhiMGI4MDYzM2NkNTcwMzBhLTE1ODU0MzMwNjciLCJncmFudHMiOnsiaWRlbnRpdHkiOiJleGFtcGxlLXVzZXIiLCJ2aWRlbyI6eyJyb29tIjoiUm9vbSBUZXN0In19LCJpYXQiOjE1ODU0MzMwNjcsImV4cCI6MTU4NTQzNjY2NywiaXNzIjoiU0tiOGNmZGYyMTI1NjI3N2Q4YjBiODA2MzNjZDU3MDMwYSIsInN1YiI6IkFDYTM2MmJhYjUzYTQzNGM1ZmIzOGJjZTY1NmMzZDFiY2YifQ.PFlenkRObweEAFp8WN1a-UUhxlkEFlI1CzjNf1BOnBc';

let afterRoomConnect = room => {
    console.log('Connected to Room "%s"', room.name);
   
    room.participants.forEach(participantConnected);
    room.on('participantConnected', participantConnected);
    room.on('participantDisconnected', participantDisconnected);
    room.once('disconnected', error => room.participants.forEach(participantDisconnected));
  };
   
  function participantConnected(participant) {
    console.log('Participant "%s" connected', participant.identity);
   
    const div = document.createElement('div');
    div.id = participant.sid;
    //div.innerText = participant.identity;
   
    participant.on('trackSubscribed', track => trackSubscribed(div, track));
    participant.on('trackUnsubscribed', trackUnsubscribed);
   
    participant.tracks.forEach(publication => {
      if (publication.isSubscribed) {
        trackSubscribed(div, publication.track);
      }
    });

    document.getElementById('remote').appendChild(div);
  }
   
  function participantDisconnected(participant) {
    console.log('Participant "%s" disconnected', participant.identity);
    document.getElementById(participant.sid).remove();
  }
   
  function trackSubscribed(div, track) {
    div.appendChild(track.attach());
  }
   
  function trackUnsubscribed(track) {
    track.detach().forEach(element => element.remove());
  }

  function mountTracks(tracks, elementId) {
    const container = document.getElementById(elementId);
    for (const track of tracks) {
      container.appendChild(track.attach());
    }
  }
  
  async function joinRoom(roomName) {
    try {
      const accessObj =  await axios.get("https://us-central1-quarantinder-twilio-272520.cloudfunctions.net/twilio-room-create?username=" + localStorage.getItem("username"));
      const localTracks = await createLocalTracks({ audio: true, video: { width: 640 } });
      mountTracks(localTracks, 'local');
      const room = await connect(accessObj.accessToken, { name: roomName, tracks: localTracks });
      afterRoomConnect(room);
      console.log(room.participants);
      console.log(`Successfully joined a Room: ${room}`);
      //configureRoomEventHandlers(room);
    } catch (error) {
      console.log(`Unable to connect to Room: ${error.message}`);
    }
  }


const button = document.getElementById('join');
button.onclick = () => joinRoom('test-room-1');
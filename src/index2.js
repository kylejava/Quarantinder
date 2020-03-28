import { connect, createLocalTracks } from 'twilio-video';

const TOKEN = '<REPLACE WITH YOUR TOKEN>';

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
    // div.innerText = participant.identity;
   
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
      const localTracks = await createLocalTracks({ audio: true, video: { width: 640 } });
      mountTracks(localTracks, 'local');
      const room = await connect(TOKEN, { name: roomName, tracks: localTracks });
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
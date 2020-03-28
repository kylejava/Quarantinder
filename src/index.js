import { connect, createLocalTracks } from 'twilio-video';

const TOKEN = '<INSERT TOKEN HERE>';

function mountTracks(tracks, elementId) {
  const container = document.getElementById(elementId);
  for (const track of tracks) {
    container.appendChild(track.attach());
  }
}

function configureRoomEventHandlers(room) {
  room.on('participantConnected', participant => {
    console.log(`A remote Participant connected: ${participant}`);
    const container = document.getElementById('remote');
    for (const publication of participant.tracks) {
      if (publication.isSubscribed) {
        container.appendChild(publication.track.attach());
      }
    }

    participant.on('trackSubscribed', track => {
      container.appendChild(publication.track.attach());
    });
  });
}

async function joinRoom(roomName) {
  try {
    const localTracks = await createLocalTracks({ audio: false, video: { width: 640 } });
    mountTracks(localTracks, 'local');
    const room = await connect(TOKEN, { name: roomName, tracks: localTracks });
    console.log(`Successfully joined a Room: ${room}`);
    configureRoomEventHandlers(room);
  } catch (error) {
    console.log(`Unable to connect to Room: ${error.message}`);
  }
}

const button = document.getElementById('join');
button.onclick = () => joinRoom('test-room-1');

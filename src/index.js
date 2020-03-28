import { connect, createLocalTracks } from 'twilio-video';

let TOKEN = '<REPLACE WITH YOUR ROOM TOKEN>';

function mountTracks(tracks, elementId) {
  const container = document.getElementById(elementId);
  for (const track of tracks) {
    container.appendChild(track.attach());
  }
}

const remote = document.getElementById('remote');

function participantConnected(participant) {
  participant.on('trackSubscribed', track => remote.appendChild(track.attach()));

  for (const { isSubscribed, track } of participant.tracks) {
    if (isSubscribed) {
      remote.appendChild(track.attach());
    }
    if (track.kind === 'audio') {
      console.log('AUDIO TRACK YAY');
    }
  }
}

function configureRoomEventHandlers(room) {
  // MOUNT EXISTING PARTICIPANTS IN THE ROOM
  room.participants.forEach(participant => {
    participantConnected(participant);
  });

  // MOUNT NEW PARTICIPANTS THAT JOIN AFTER YOU
  room.on('participantConnected', participantConnected);
}

async function joinRoom(roomName) {
  try {
    const localTracks = await createLocalTracks({ audio: true, video: { width: 640 } });
    mountTracks(localTracks, 'local');
    const room = await connect(TOKEN, { name: roomName, tracks: localTracks });

    room.localParticipant.audioTracks.forEach(audioTrack => {

    });

    console.log(room.participants);
    console.log(`Successfully joined a Room: ${room}`);
    configureRoomEventHandlers(room);
  } catch (error) {
    console.log(`Unable to connect to Room: ${error.message}`);
  }
}

const button = document.getElementById('join');
button.onclick = () => joinRoom('test-room-1');

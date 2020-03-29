import { connect, createLocalTracks } from 'twilio-video';

const TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTSzNjNGUwMDVmZmM0MzdhNjQwZjI3YThmOTIyMjlkNDdjLTE1ODU0MjU0NjIiLCJpc3MiOiJTSzNjNGUwMDVmZmM0MzdhNjQwZjI3YThmOTIyMjlkNDdjIiwic3ViIjoiQUMyMWEwZTM2ZTMxZTBlODBjNzM5NDZiNmMzOGM1OWExMCIsImV4cCI6MTU4NTQyOTA2MiwiZ3JhbnRzIjp7ImlkZW50aXR5IjoidGVzdC1jbGllbnQtMiIsInZpZGVvIjp7InJvb20iOiJ0ZXN0LXJvb20tMSJ9fX0.HzUNF7-NHOtVKT_MIpRjtCDEfjv8TSkWSgYDCkIbSW8';

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
      audioTrack.on()
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

// Get random joke using Dad joke API
async function getJoke() {
  const url = 'https://icanhazdadjoke.com/'
  const res = await fetch(url, {
    headers: { 'Accept': 'application/json' }
  });
  const { joke } = await res.json();
  document.getElementById('joke-text').innerHTML = joke;
}

document.getElementById('joke-button').onclick = () => getJoke();

import axios from 'axios';

const Chat = require('twilio-chat');



let tc = {};


function initChannel(channel) {
    console.log('Initialized channel ' + channel.friendlyName);
    return tc.messagingClient.getChannelBySid(channel.sid);
  }
tc.joinGeneralChannel = function() {
    console.log('Attempting to join "general" chat channel...');
    if (!tc.generalChannel) {
      // If it doesn't exist, let's create it
      tc.messagingClient.createChannel({
        uniqueName: "GENERAL_CHANNEL_UNIQUE_NAME",
        friendlyName: "GENERAL_CHANNEL_NAME"
      }).then(function(channel) {
        console.log('Created general channel');
        tc.generalChannel = channel;
        tc.loadChannelList(tc.joinGeneralChannel);
      });
    }
    else {
      console.log('Found general channel:');
      
      setupChannel(tc.generalChannel);
    }
  };
  tc.loadChannelList = function(handler) {
    if (tc.messagingClient === undefined) {
      console.log('Client is not initialized');
      return;
    }

    tc.messagingClient.getPublicChannelDescriptors().then(function(channels) {
      tc.channelArray = tc.sortChannelsByName(channels.items);
      $channelList.text('');
      tc.channelArray.forEach(addChannel);
      if (typeof handler === 'function') {
        handler();
      }
    });
  };
function initChat(accessToken){
    Chat.Client.create(accessToken).then(client => {
        tc.messagingClient = client;
        //updateConnectedUI();
        tc.loadChannelList(tc.joinGeneralChannel);
        // tc.messagingClient.on('channelAdded', $.throttle(tc.loadChannelList));
        // tc.messagingClient.on('channelRemoved', $.throttle(tc.loadChannelList));
        // tc.messagingClient.on('tokenExpired', refreshToken);
    });
}


document.getElementById('joinChat').addEventListener('click', function(){
    axios.get("https://us-central1-quarantinder-twilio-272520.cloudfunctions.net/twilio-chat-create?username=" + localStorage.getItem('username') )
        .then(res =>{
            initChat(res.accessToken);
        });
});


# Quarantinder
Date with confidence, even during an pandemic.

## Inspiration
The COVID-19 pandemic has significantly impeded social interaction among people. Dating is one activity that has been made significantly given the present circumstances. We wanted to create a service that lets people go on virtual dates from the comfort of their own home.

## What it does
Quarantinder is essentially a video chat app enhanced with tools and features that allow for a smooth, virtualized dating experience. Two people can go on a date by simply entering the same meeting room. A person can press a button to automatically send a text notification to the other party to signify that they wish to go on a date. There is a Joke button that uses the publically available https://icanhazdadjoke.com/api to generate random dad jokes in case one needs to impress the other person.

## How we built it
Quarantinder was built using the Twilio API to embed video call functionality into the web app, generate room access tokens, as well as integrate the text notification feature. The front end was built using vanilla JavaScript, HTML, and CSS along with the Bootstrap library.

## Challenges we ran into
The original intention was to integrate live video chat audio processing with Google Cloud that would dynamically transcribe the audio and process the audio text through Google Cloud NLP in order to analyze sentiment during the conversation and generate topics to talk about. However, piping video audio from Twilio audio tracks into Google Cloud Speech services proved a very difficult task that we were not able to figure out in the allotted time.

## Accomplishments that we're proud of
We were able to build a functioning webapp with video chat capabilities.

## What we learned
We learned about how to embed video chat into a web application using Twilio APIs as well as the numerous challenges associated with working with live-streaming data.

## What's next for Quarantinder
We want to continue looking into how we can integrate live video chat audio processing into the application.


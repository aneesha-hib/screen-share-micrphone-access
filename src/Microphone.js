// src/Microphone.js

import React, { useState, useRef } from 'react';

const Microphone = () => {
  const [audioStream, setAudioStream] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const audioRef = useRef(null);

  const startMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      audioRef.current.srcObject = stream;

      const mediaRecorder = new MediaRecorder(stream);
      let chunks = [];

      mediaRecorder.ondataavailable = event => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        chunks = [];
        const audioURL = URL.createObjectURL(blob);
        setAudioURL(audioURL);
      };

      setRecorder(mediaRecorder);
    } catch (err) {
        alert("Requested device is not found")
      console.error("Error: " + err);
    }
  };

  const startRecording = () => {
    if (recorder) {
      recorder.start();
      setRecording(true);
    }
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.stop();
      setRecording(false);
    }
  };

  const stopMicrophone = () => {
    if (audioStream) {
      const tracks = audioStream.getTracks();
      tracks.forEach(track => track.stop());
      audioRef.current.srcObject = null;
      setAudioStream(null);
    }
  };

  return (
    <div>
      <h1>Microphone Access Example</h1>
      <button onClick={startMicrophone}>Start Microphone</button>
      <button onClick={stopMicrophone} disabled={!audioStream}>Stop Microphone</button>
      <button onClick={startRecording} disabled={!audioStream || recording}>Start Recording</button>
      <button onClick={stopRecording} disabled={!recording}>Stop Recording</button>
      <audio ref={audioRef} autoPlay style={{ display: 'none' }}></audio>
      {audioURL && (
        <div>
          <h2>Recorded Audio:</h2>
          <audio src={audioURL} controls></audio>
          <a href={audioURL} download="recording.webm">Download Recording</a>
        </div>
      )}
    </div>
  );
};

export default Microphone;

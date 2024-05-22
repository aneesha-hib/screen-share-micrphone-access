// src/ScreenSharing.js

import React, { useState, useRef } from 'react';

const ScreenSharing = () => {
  const [stream, setStream] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState("");
  const videoRef = useRef(null);

  const startScreenShare = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });
      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);

      const mediaRecorder = new MediaRecorder(mediaStream);
      let chunks = [];

      mediaRecorder.ondataavailable = event => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        chunks = [];
        const videoURL = URL.createObjectURL(blob);
        setVideoURL(videoURL);
      };

      setRecorder(mediaRecorder);
    } catch (err) {
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

  const stopScreenShare = () => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setStream(null);
    }
  };

  return (
    <div>
      <h1>Screen Sharing Example</h1>
      <button onClick={startScreenShare}>Start Screen Sharing</button>
      <button onClick={stopScreenShare} disabled={!stream}>Stop Screen Sharing</button>
      <button onClick={startRecording} disabled={!stream || recording}>Start Recording</button>
      <button onClick={stopRecording} disabled={!recording}>Stop Recording</button>
      <video ref={videoRef} autoPlay style={{ width: '100%', border: '1px solid black' }}></video>
      {videoURL && (
        <div>
          <h2>Preview:</h2>
          <video src={videoURL} controls style={{ width: '100%', border: '1px solid black' }}></video>
          <a href={videoURL} download="recording.webm">Download Recording</a>
        </div>
      )}
    </div>
  );
};

export default ScreenSharing;

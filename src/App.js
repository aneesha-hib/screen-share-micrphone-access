// src/App.js

import React, { useState } from "react";
import ScreenSharing from "./ScreenSharing";
import Microphone from "./Microphone";
import "./App.css"

function App() {
  const [screen, setScreen] = useState(0);

  return (
    <div className="App">
      <div className="button-container">
        <div className="buttonCont" onClick={() => setScreen(1)}>Screen sharing</div>
        <div className="buttonCont" onClick={() => setScreen(2)}>Microphone access</div>
      </div>
      {screen === 1 && <ScreenSharing />}
      {screen === 2 && <Microphone />}
    </div>
  );
}

export default App;

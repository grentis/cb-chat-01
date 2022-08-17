import React from 'react';
import './App.css';
import { ChatSystem } from './lib';

function App() {
  return (
    <div className="App">
      <ChatSystem server='ws://127.0.0.1:8000'></ChatSystem>
    </div>
  );
}

export default App;

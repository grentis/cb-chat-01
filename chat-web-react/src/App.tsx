import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ChatSystem } from './lib';

function App() {
  return (
    <div className="App">
      <ChatSystem server='ws://192.168.1.11:8000'></ChatSystem>
    </div>
  );
}

export default App;

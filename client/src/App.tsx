import { url } from 'inspector';
import React from 'react';
import './App.css';
import ReactPlayer from 'react-player/youtube'
import { input } from './test'
function App() {
  
  return (
    <div className="App">
      <header className="App-header">
        <div>
        hi<ReactPlayer url='https://www.youtube.com/watch?v=ysz5S6PUM-U' />


        </div>
      </header>
    </div>
  );
}

export default App;

import React from 'react';
import './App.css';

import Home from './Home'

// Electron related imports
const electron = window.require('electron');
const { ipcRenderer } = electron;
const loadBalancer = window.require('electron-load-balancer');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount(){
    // 1. Starting preemptive loop as soon as app starts
    console.log("preemptive loop started")
    loadBalancer.start(ipcRenderer, 'preemptive_loop');
  }

  componentWillUnmount(){
    // 2. Shutdown preemptive loop before app stops
    loadBalancer.stop(ipcRenderer, 'preemptive_loop');
  }

  render() {
    return (
      <Home/>
    );
  }
}

export default App;

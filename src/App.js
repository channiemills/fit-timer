import React, { Component } from 'react';

import BaseTimer from './components/BaseTimer';

class App extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="App">
        <div className="App-title">Workout Timers</div>
        <div className="Timers">
          <BaseTimer />
        </div>
      </div>
    );
  }
}

export default App;

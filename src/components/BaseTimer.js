import React, { Component } from 'react';
import '../App.css';

const MAX_DURATION = 5940000; // max duration 99 minutes
const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * ONE_SECOND;

class BaseTimer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timerOn: false,
      countDown: true, // probably can go in redux to be shared in other Timers
      setTime: 0,
      currentTime: 0,
    };
  }

  getTimerAdjustButtons() {
    return (
      <div className="BaseTimer-display">
        <button type="button" onClick={() => this.adjustTimer('incMinutes')}>&#8679;</button>
        <button type="button" onClick={() => this.adjustTimer('decMinutes')}>&#8681;</button>
        <button type="button" onClick={() => this.adjustTimer('incSeconds')}>&#8679;</button>
        <button type="button" onClick={() => this.adjustTimer('decSeconds')}>&#8681;</button>
      </div>
    );
  }

  startTimer = () => {
    const { countDown, currentTime, setTime } = this.state;
    const newSetTime = setTime || currentTime;
    let currentCountUpTime;

    if (!countDown) {
      currentCountUpTime = setTime ? currentTime : 0;
      // currentCountUpTime logic -> if starting for 1st time, currentTime must be 0.
      // When starting from pause, should be currentTime
      // may still need some kind of flag for set but paused,
      // but that should be capturable from setTime
      // can also consider another button for clearing everything
    }


    this.setState({
      timerOn: true,
      setTime: newSetTime,
      // Always want the set time to be what the clock was orignally set for.
      // Think about how not to overwrite this when paused
      currentTime: currentCountUpTime != null ? currentCountUpTime : currentTime,
    });


    this.timer = setInterval(() => {
      let newTime;
      if (countDown) {
        newTime = currentTime - 10;
      } else {
        newTime = currentTime + 10;
      }

      // update time for countdown and countup
      if ((countDown && newTime >= 0) || (!countDown && newTime <= setTime)) {
        this.setState({
          currentTime: newTime,
        });
      } else {
        clearInterval(this.timer);
        this.setState({
          timerOn: false,
          setTime: 0, // so countup can be rerun
        });
        alert('Timer ended');
      }
    }, 10);
  };

  stopTimer = () => {
    clearInterval(this.timer);
    this.setState({ timerOn: false });
  };

  resetTimer = () => {
    const { timerOn, setTime } = this.state;
    if (!timerOn) {
      this.setState({
        currentTime: setTime,
        setTime: 0,
      });
    }
  };

  toggleCountDirection = () => {
    const { countDown } = this.state;
    this.setState({ countDown: !countDown }); // async risk?
  }

  adjustTimer(input) {
    // DRY?
    const { currentTime, timerOn } = this.state;
    if (!timerOn) { // possible switch statement? DRY this up
      if (input === 'incMinutes' && currentTime + ONE_MINUTE < MAX_DURATION) {
        this.setState({ currentTime: currentTime + ONE_MINUTE });
      } else if (input === 'decMinutes' && currentTime - ONE_MINUTE >= 0) {
        this.setState({ currentTime: currentTime - ONE_MINUTE });
      } else if (input === 'incSeconds' && currentTime + ONE_SECOND < MAX_DURATION) {
        this.setState({ currentTime: currentTime + ONE_SECOND });
      } else if (input === 'decSeconds' && currentTime - ONE_SECOND >= 0) {
        this.setState({ currentTime: currentTime - ONE_SECOND });
      }
    }
  }

  render() {
    // figure out why this render is being called 2x
    const {
      currentTime, setTime, timerOn, countDown,
    } = this.state;
    const seconds = ('0' + (Math.floor((currentTime / ONE_SECOND) % 60) % 60)).slice(-2);
    const minutes = ('0' + Math.floor((currentTime / ONE_MINUTE) % 60)).slice(-2);
    return (
      <div className="BaseTimer">
        <div className="BaseTimer-header">Base Timer</div>
        <div className="BaseTimer-time">{minutes} : {seconds}</div>
        {!timerOn && !setTime && this.getTimerAdjustButtons()}
        <div className="BaseTimer-controls">
          {!timerOn && (setTime === 0 || currentTime === setTime) && (
            <button type="button" onClick={this.startTimer}>Start</button>
          )}
          {timerOn && currentTime >= ONE_SECOND && (
            <button type="button" onClick={this.stopTimer}>Stop</button>
          )}
          {!timerOn && (setTime !== 0 && setTime !== currentTime && currentTime !== 0) && (
            <button type="button" onClick={this.startTimer}>Resume</button>
          )}
          {(!timerOn || currentTime < ONE_SECOND)
            && (setTime !== currentTime) && (
              <button type="button" onClick={this.resetTimer}>Reset</button>
          )}
        </div>
        <div>
          <button type="button" onClick={this.toggleCountDirection}>{countDown ? 'Count Up' : 'Count Down'}</button>
        </div>
      </div>
    );
  }
}

export default BaseTimer;

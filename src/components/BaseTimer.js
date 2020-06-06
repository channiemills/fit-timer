import React, { Component } from "react";
import "../App.css";

const MAX_DURATION = 5940000; // max duration 99 minutes
const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * ONE_SECOND;

class BaseTimer extends Component {
  state = {
    timerOn: false,
    timerStart: 0,
    currentTime: 0,
    countDown: true, // probably can go in redux, yikes
    countUpTime: 0 // can this be DRYer?
  };

  startTimer = () => {
    const { countDown, currentTime, countUpTime } = this.state;

    this.setState({ timerOn: true });

    if (countDown) {
      this.setState({
        timerStart: currentTime
      });
    } else {
        // using countUpTime to flag if starting from pause or new timer
        this.setState({
          currentTime: countUpTime? currentTime : 0,  // if countUpTime, that means it was paused and should use the currently displayed time to resume
          countUpTime: countUpTime? countUpTime : currentTime // if countUpTime, that means it was paused and should use the count
        });
    }

    this.timer = setInterval(() => {
      let newTime;
      if (countDown) {
        newTime = this.state.currentTime - 10;
      } else {
        newTime = this.state.currentTime + 10;
      }

      // update time for countdown and countup
      if ((countDown && newTime >= 0) || (!countDown && newTime <= this.state.countUpTime)) {
        this.setState({
          currentTime: newTime
        });
      } else {
          clearInterval(this.timer);
          this.setState({
            timerOn: false,
            countUpTime: 0 // so countup can be rerun
          });
          alert("Timer ended");
      }
    }, 10);
  };

  stopTimer = () => {
    clearInterval(this.timer);
    this.setState({ timerOn: false });
  };

  resetTimer = () => {
    if (!this.state.timerOn) {
      this.setState({
        currentTime: this.state.timerStart
      });
    }
  };

  adjustTimer = input => { // clean this up. 
    // input syntax.
    // DRY. 
    // think about how this might have to change for count up
    // think about how this needs to change since not using hours
    const { currentTime, timerOn } = this.state;
    if (!timerOn) { // possible switch statement? DRY this up
      if (input === "incMinutes" && currentTime + ONE_MINUTE < MAX_DURATION) {
        this.setState({ currentTime: currentTime + ONE_MINUTE });
      } else if (input === "decMinutes" && currentTime - ONE_MINUTE >= 0) {
        this.setState({ currentTime: currentTime - ONE_MINUTE });
      } else if (input === "incSeconds" && currentTime + ONE_SECOND < MAX_DURATION) {
        this.setState({ currentTime: currentTime + ONE_SECOND });
      } else if (input === "decSeconds" && currentTime - ONE_SECOND >= 0) {
        this.setState({ currentTime: currentTime - ONE_SECOND });
      }
    }
  };

  getTimerAdjustButtons() {
    return (
      <div className="BaseTimer-display">{/*probably only display these when timer off*/}
        <button onClick={() => this.adjustTimer("incMinutes")}>&#8679;</button>
        <button onClick={() => this.adjustTimer("decMinutes")}>&#8681;</button>
        <button onClick={() => this.adjustTimer("incSeconds")}>&#8679;</button>
        <button onClick={() => this.adjustTimer("decSeconds")}>&#8681;</button>
      </div>
    );
  }

  toggleCountDirection = () => {
    this.setState({ countDown: !this.state.countDown}); //async risk?
  }

  render() {
    // figure out why this render is being called 2x
    const { currentTime, timerStart, timerOn } = this.state;
    let seconds = ("0" + (Math.floor((currentTime / ONE_SECOND) % 60) % 60)).slice(-2);
    let minutes = ("0" + Math.floor((currentTime / ONE_MINUTE) % 60)).slice(-2);
    return (
      <div className="BaseTimer">
        <div className="BaseTimer-header">Base Timer</div>
        <div className="BaseTimer-label">Minutes : Seconds</div>
        <div className="BaseTimer-time">
          {minutes} : {seconds}
        </div>
        {this.getTimerAdjustButtons()}
        <div className="BaseTimer-controls">
          {!timerOn && (timerStart === 0 || currentTime === timerStart) && (
            <button onClick={this.startTimer}>Start</button>
          )}
          {timerOn && currentTime >= ONE_SECOND && (
            <button onClick={this.stopTimer}>Stop</button>
          )}
          {!timerOn &&
            (timerStart !== 0 && timerStart !== currentTime && currentTime !== 0) && (
          <button onClick={this.startTimer}>Resume</button>
          )}
          {(!timerOn || currentTime < ONE_SECOND) &&
            (timerStart !== currentTime && timerStart > 0) && (
              <button onClick={this.resetTimer}>Reset</button>
           )}
        </div>
        <div>
          <button onClick={this.toggleCountDirection}>{this.state.countDown? 'Count Up' : 'Count Down'}</button>
        </div>
      </div>
    );
  }
}

export default BaseTimer;

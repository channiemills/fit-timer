import React, { Component } from "react";
import "../App.css";

const MAX_DURATION = 5940000; // max duration 99 minutes
const ONE_SECOND = 1000;
const ONE_MINUTE = 60000;

class BaseTimer extends Component {
  state = {
    timerOn: false,
    timerStart: 0,
    timerTime: 0
  };

  startTimer = () => {
    this.setState({
      timerOn: true,
      timerTime: this.state.timerTime,
      timerStart: this.state.timerTime
    });
    this.timer = setInterval(() => {
      const newTime = this.state.timerTime - 10;
      if (newTime >= 0) {
        this.setState({
          timerTime: newTime
        });
      } else {
        clearInterval(this.timer);
        this.setState({ timerOn: false });
        alert("Countdown ended");
      }
    }, 10);
  };

  stopTimer = () => {
    clearInterval(this.timer);
    this.setState({ timerOn: false });
  };

  resetTimer = () => {
    if (this.state.timerOn === false) {
      this.setState({
        timerTime: this.state.timerStart
      });
    }
  };

  adjustTimer = input => { // clean this up. 
    // input syntax.
    // DRY. 
    // think about how this might have to change for count up
    // think about how this needs to change since not using hours
    const { timerTime, timerOn } = this.state;
    if (!timerOn) { // possible switch statement? DRY this up
      if (input === "incMinutes" && timerTime + 60000 < MAX_DURATION) {
        this.setState({ timerTime: timerTime + 60000 });
      } else if (input === "decMinutes" && timerTime - 60000 >= 0) {
        this.setState({ timerTime: timerTime - 60000 });
      } else if (input === "incSeconds" && timerTime + 1000 < MAX_DURATION) {
        this.setState({ timerTime: timerTime + 1000 });
      } else if (input === "decSeconds" && timerTime - 1000 >= 0) {
        this.setState({ timerTime: timerTime - 1000 });
      }
    }
  };

  getTimerButton(timerOn, timerStart, timerTime) {
    if (timerOn && timerTime >= 1000) {
      return (
        (timerStart === 0 || timerStart === timerTime) && (
          <button onClick={this.startTimer}>Start</button>
        )
      )}
    return (
      {/*some jsx*/}
    )
  }

  render() {
    const { timerTime, timerStart, timerOn } = this.state;
    let seconds = ("0" + (Math.floor((timerTime / 1000) % 60) % 60)).slice(-2);
    let minutes = ("0" + Math.floor((timerTime / 60000) % 60)).slice(-2);
    return (
      <div className="BaseTimer">
        <div className="BaseTimer-header">Base Timer</div>
        <div className="BaseTimer-label">Minutes : Seconds</div>
        <div className="BaseTimer-time">
          {minutes} : {seconds}
        </div>
        <div className="BaseTimer-display">{/*probably only display these when timer off*/}
          <button onClick={() => this.adjustTimer("incMinutes")}>&#8679;</button>
          <button onClick={() => this.adjustTimer("decMinutes")}>&#8681;</button>
          <button onClick={() => this.adjustTimer("incSeconds")}>&#8679;</button>
          <button onClick={() => this.adjustTimer("decSeconds")}>&#8681;</button>
        </div>
        <div className="BaseTimer-controls">
          {!timerOn && (timerStart === 0 || timerTime === timerStart) && (
            <button onClick={this.startTimer}>Start</button>
          )}
          {timerOn && timerTime >= 1000 && (
            <button onClick={this.stopTimer}>Stop</button>
          )}
          {!timerOn &&
            (timerStart !== 0 && timerStart !== timerTime && timerTime !== 0) && (
          <button onClick={this.startTimer}>Resume</button>
          )}
          {(!timerOn || timerTime < 1000) &&
            (timerStart !== timerTime && timerStart > 0) && (
              <button onClick={this.resetTimer}>Reset</button>
           )}
        </div>
      </div>
    );
  }
}

export default BaseTimer;

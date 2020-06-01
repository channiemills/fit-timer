import React, { Component } from "react";
import "../App.css";

const MAX_DURATION = 5940000; // max duration 99 minutes
const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * ONE_SECOND;

class BaseTimer extends Component {
  state = {
    timerOn: false,
    timerStart: 0,
    timerTime: 0,
    countDown: true,
    countUpTime: 0 // can this be DRYer?
  };

  startTimer = () => {
    const { countDown, timerTime, countUpTime } = this.state;

    this.setState({ timerOn: true})

    if (countDown) {
      this.setState({
        timerStart: timerTime
      });
    } else {
        // using countUpTime to flag if starting from pause or new timer
        this.setState({
          timerTime: countUpTime? timerTime : 0,
          countUpTime: countUpTime? countUpTime : timerTime
        })
    }

    this.timer = setInterval(() => {
      let newTime;
      if (countDown) {
        newTime = this.state.timerTime - 10;
      } else {
        newTime = this.state.timerTime + 10;
      }

      // update time for countdown and countup
      if ((countDown && newTime >= 0) || (!countDown && newTime <= this.state.countUpTime)) {
        this.setState({
          timerTime: newTime
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
      if (input === "incMinutes" && timerTime + ONE_MINUTE < MAX_DURATION) {
        this.setState({ timerTime: timerTime + ONE_MINUTE });
      } else if (input === "decMinutes" && timerTime - ONE_MINUTE >= 0) {
        this.setState({ timerTime: timerTime - ONE_MINUTE });
      } else if (input === "incSeconds" && timerTime + ONE_SECOND < MAX_DURATION) {
        this.setState({ timerTime: timerTime + ONE_SECOND });
      } else if (input === "decSeconds" && timerTime - ONE_SECOND >= 0) {
        this.setState({ timerTime: timerTime - ONE_SECOND });
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
    const { timerTime, timerStart, timerOn } = this.state;
    let seconds = ("0" + (Math.floor((timerTime / ONE_SECOND) % 60) % 60)).slice(-2);
    let minutes = ("0" + Math.floor((timerTime / ONE_MINUTE) % 60)).slice(-2);
    return (
      <div className="BaseTimer">
        <div className="BaseTimer-header">Base Timer</div>
        <div className="BaseTimer-label">Minutes : Seconds</div>
        <div className="BaseTimer-time">
          {minutes} : {seconds}
        </div>
        {this.getTimerAdjustButtons()}
        <div className="BaseTimer-controls">
          {!timerOn && (timerStart === 0 || timerTime === timerStart) && (
            <button onClick={this.startTimer}>Start</button>
          )}
          {timerOn && timerTime >= ONE_SECOND && (
            <button onClick={this.stopTimer}>Stop</button>
          )}
          {!timerOn &&
            (timerStart !== 0 && timerStart !== timerTime && timerTime !== 0) && (
          <button onClick={this.startTimer}>Resume</button>
          )}
          {(!timerOn || timerTime < ONE_SECOND) &&
            (timerStart !== timerTime && timerStart > 0) && (
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

import React, { Component } from "react";
import "../App.css";

const MAX_DURATION = 5940000; // max duration 99 minutes
const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * ONE_SECOND;

class BaseTimer extends Component {
  state = {
    timerOn: false,
    countDown: true, // probably can go in redux, yikes
    setTime: 0,
    currentTime: 0,
    countUpTime: 0 // can this be DRYer?
  };

  startTimer = () => {
    const { countDown, currentTime, countUpTime, setTime } = this.state;

    this.setState({
      timerOn: true,
      setTime: setTime? setTime : currentTime, // Always want the set time to be what the clock was orignally set for. Think about how not to overwrite this when paused
    });

    // if (countDown) {
    //   this.setState({
    //     setTime: currentTime
    //   });
    // } else {
    //     // using countUpTime to flag if starting from pause or new timer
    //     this.setState({
    //       currentTime: countUpTime? currentTime : 0,  // if countUpTime, that means it was paused and should use the currently displayed time to resume
    //       countUpTime: countUpTime? countUpTime : currentTime // here is where we're setting the setTime if there isn't one already...
    //     });
    // }
    if (!countDown) {
      console.log('set time');
      console.log(this.state.setTime);
      this.setState({
        currentTime: setTime? currentTime : 0, // this is causing a bug when resetting countUp
      });
    };

    console.log(this.state.setTime);
    this.timer = setInterval(() => {
      // console.log('curentTime');
      // console.log(currentTime);
      let newTime;
      if (countDown) {
        newTime = this.state.currentTime - 10;
      } else {
        newTime = this.state.currentTime + 10;
      }
      // console.log('newTime');
      // console.log(newTime)

      // update time for countdown and countup
      if ((countDown && newTime >= 0) || (!countDown && newTime <= this.state.setTime)) {
        this.setState({
          currentTime: newTime
        });
      } else {
          clearInterval(this.timer);
          this.setState({
            timerOn: false,
            setTime: 0 // so countup can be rerun
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
        currentTime: this.state.setTime // reset to setTime if currentTime != setTime, else 0?
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
    const { currentTime, setTime, timerOn } = this.state;
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
          {!timerOn && (setTime === 0 || currentTime === setTime) && (
            <button onClick={this.startTimer}>Start</button>
          )}
          {timerOn && currentTime >= ONE_SECOND && (
            <button onClick={this.stopTimer}>Stop</button>
          )}
          {!timerOn &&
            (setTime !== 0 && setTime !== currentTime && currentTime !== 0) && (
          <button onClick={this.startTimer}>Resume</button>
          )}
          {(!timerOn || currentTime < ONE_SECOND) &&
            (setTime !== currentTime && setTime > 0) && (
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

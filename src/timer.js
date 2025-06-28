export default class Timer {
  constructor(timerElement) {
    this.timer = timerElement;
    this.intervalId = null;
    this.isActive = false;
    this.result = null;
  }

  start() {
    if (this.isActive === true) {
      return;
    }

    const startTime = Date.now();
    this.isActive = true;

    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = currentTime - startTime;
      const { hours, mins, secs } = this.getTimeComponents(deltaTime);
      this.timer.textContent = `${hours}:${mins}:${secs}`;
    }, 1000);
  }

  stop() {
    this.result = this.timer.textContent;
    this.isActive = false;
    clearInterval(this.intervalId);
  }

  getTimeComponents(time) {
    const hours = this.pad(
      Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    );
    const mins = this.pad(Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)));
    const secs = this.pad(Math.floor((time % (1000 * 60)) / 1000));

    return { hours, mins, secs };
  }

  pad(value) {
    return String(value).padStart(2, "0");
  }
}

export function getCurrentTimeInSeconds(timerValue) {
  const minutesInSeconds = +timerValue.split(":")[0] * 60;
  const seconds = +timerValue.split(":")[1];
  return minutesInSeconds + seconds;
}

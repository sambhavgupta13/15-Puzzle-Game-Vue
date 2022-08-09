export function getCurrentTimeInSeconds(timerValue) {
  if(!timerValue){
    timerValue="00:00"
  }
  const minutesInSeconds = +timerValue.split(":")[0] * 60;
  const seconds = +timerValue.split(":")[1];
  return minutesInSeconds + seconds;
}

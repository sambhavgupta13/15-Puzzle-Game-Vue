import { setLocalStorageValues } from "./setLocalStorageValues";
export function getTimerValue(currentTime) {
  let timeValue = "";
  if (currentTime < 60) {
    (timeValue = currentTime <= 9 ? `00:0${currentTime}` : `00:${currentTime}`),
      setLocalStorageValues("currentTime", timeValue);
    return timeValue;
  }
  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime - 60 * minutes;
  if (minutes <= 9 && seconds <= 9) {
    timeValue = `0${minutes}:0${seconds}`;
  } else if (minutes <= 9 && seconds > 9) {
    timeValue = `0${minutes}:${seconds}`;
  } else if (minutes > 9 && seconds <= 9) {
    timeValue = `${minutes}:0${seconds}`;
  } else {
    timeValue = `${minutes}:${seconds}`;
  }

  setLocalStorageValues("currentTime", timeValue);
  return timeValue;
}

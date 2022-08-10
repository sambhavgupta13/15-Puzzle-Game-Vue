<template>
  <div class="Game_screen">
    <div class="Game_screen_activity">
      <div class="Game_screen_activity_moves-display">
        Moves
        {{ countValue }}
      </div>

      <div class="Game_screen_activity_time-display">
        Time

        {{ Time }}
      </div>
      <div class="Game_screen_activity_controller-buttons">
        <button
          v-show="startGame"
          @click="
            startGameFunction(),
              (startGame = !startGame),
              (pauseGame = !pauseGame),
              (boardCoverShowProp = false)
          "
          title="Click here to Start "
        >
          <img src="../assets/startIcon.svg" alt="start the game" />
        </button>
        <button
          v-show="pauseGame"
          @click="
            pauseGameFunction(),
              (pauseGame = !pauseGame),
              (boardCoverShowProp = true),
              (resumeGame = !resumeGame)
          "
          title="Click here to Pause "
        >
          <img src="../assets/pauseIcon.svg" alt="pause the game" />
        </button>
        <button
          v-show="resumeGame"
          @click="
            resumeGameFunction(),
              (pauseGame = !pauseGame),
              (boardCoverShowProp = false),
              (resumeGame = !resumeGame)
          "
          title="Click here to Resume "
        >
          <img src="../assets/resumeIcon.svg" alt="resume the game" />
        </button>
        <button
          @click="
            resetGameFunction(),
              (pauseGame = false),
              (boardCoverShowProp = true),
              (startGame = true),
              (resumeGame = false)
          "
          title="Click here to Reset "
        >
          <img src="../assets/resetIcon.svg" alt="reset the game" />
        </button>
      </div>
    </div>

    <Board
      :reset="resetGame"
      :boardCoverShowToggle="boardCoverShowProp"
      :timeValue="Time"
      @updateCounter="updateCountValue($event)"
      @boardCoverClicked="
        resumeGameFunction(),
          (boardCoverShowProp = !boardCoverShowProp),
          (startGame = false),
          (pauseGame = true),
          (resumeGame = false)
      "
      @resetGame="resetGameFunction()"
    />
  </div>
</template>

<script>
import { setLocalStorageValues } from "../Mixins/setLocalStorageValues";
import { getTimerValue } from "../Mixins/getTimerValue";
import { getCurrentTimeInSeconds } from "../Mixins/getCurrentTimeInSeconds";
import Board from "./Board.vue";

export default {
  name: "Screen",
  components: {
    Board,
  },
  data() {
    return {
      Time: "00:00",
      startGame: true,
      pauseGame: false,
      resumeGame: false,
      resetGame: false,
      timeInterval: null,
      boardCoverShowProp: true,
      countValue: 0,
    };
  },
  beforeMount() {
    let timeInSeconds = getCurrentTimeInSeconds(
      localStorage.getItem("currentTime")
    );

    if (timeInSeconds > 0) {
      // if the game is in resume state ask the user if he wants to resume or start a new game

      const status = confirm("You want to resume ?");
      if (status) {
        this.Time = localStorage.getItem("currentTime");
        this.startGame = false;
        this.pauseGame = false;
        this.resumeGame = true;
        this.countValue = +localStorage.getItem("currentMoves");
      } else {
        this.Time = "00:00";
        setLocalStorageValues("currentMoves", this.countValue);
      }
    }
    setLocalStorageValues("currentTime", this.Time);
  },
  updated() {
    this.resetGame = false;
  },
  methods: {
    // function to update the value of moves count
    updateCountValue(value) {
      this.countValue = value;
    },
    startGameFunction() {
      const timeInSeconds =
        new Date().getMinutes() * 60 + new Date().getSeconds();

      this.timeInterval = setInterval(() => {
        const newDate = new Date();

        const newTime = newDate.getMinutes() * 60 + newDate.getSeconds();

        const currentTime = newTime - timeInSeconds;
        this.Time = getTimerValue(currentTime);
      }, 1000);
    },
    pauseGameFunction() {
      clearInterval(this.timeInterval);
    },
    resumeGameFunction() {
      let currentTimeInSeconds = getCurrentTimeInSeconds(this.Time);
      currentTimeInSeconds++;
      this.timeInterval = setInterval(() => {
        this.Time = getTimerValue(currentTimeInSeconds);
        currentTimeInSeconds++;
      }, 1000);
    },
    resetGameFunction() {
      clearInterval(this.timeInterval);
      this.Time = "00:00";
      setLocalStorageValues("currentTime", this.Time);

      this.resetGame = true;

      this.countValue = 0;
      setLocalStorageValues("currentMoves", this.countValue);
    },
  },
};
</script>

<style scoped>
.Game_screen_activity_time-display {
  display: inline-block;
  max-width: 100px;
  height: 70px;
  background-color: rgb(122, 203, 223);
  padding: 10px;
  justify-content: center;
  /* align-items: center;
  text-align: center; */
  box-sizing: border-box;
  font-size: 18pt;
  font-weight: bold;
  border-radius: 25px;
  margin: 10px;
}
.Game_screen_activity_controller-buttons {
  display: inline-block;
}
.Game_screen_activity_moves-display {
  display: inline-block;
  max-width: 100px;
  height: 70px;
  background-color: rgb(122, 203, 223);
  padding: 10px;
  justify-content: center;
  /* align-items: center;
  text-align: center; */
  box-sizing: border-box;

  border-radius: 25px;
}

.Game_screen_activity {
  padding: 10px;
  border: 2px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
  /* margin: 20px; */
  max-width: 400px;
  margin: auto;
  border-radius: 25px;
  height: 120px;
  font-size: 18pt;
  font-weight: bolder;
  color: black;
}
.Game_screen_activity_controller-buttons button {
  background-color: black;
  border-radius: 50%;
  height: 40px;
  width: 40px;
  margin: 5px;
}
@media screen and (max-width: 359px) {
  .Game_screen_activity {
    height: 150px;
    display: inline-block;
  }
}
</style>

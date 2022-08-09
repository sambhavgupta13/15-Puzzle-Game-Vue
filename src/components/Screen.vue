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
          @click="toggleTimer({ command: 'START' })"
          title="Click here to Start "
        >
          <img src="../assets/startIcon.svg" alt="start the game" />
        </button>
        <button
          v-show="pauseGame"
          @click="toggleTimer({ command: 'PAUSE' })"
          title="Click here to Pause "
        >
          <img src="../assets/pauseIcon.svg" alt="pause the game" />
        </button>
        <button
          v-show="resumeGame"
          @click="toggleTimer({ command: 'RESUME' })"
          title="Click here to Resume "
        >
          <img src="../assets/resumeIcon.svg" alt="resume the game" />
        </button>
        <button
          @click="toggleTimer({ command: 'RESET' })"
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
      @boardCoverClicked="toggleTimer({ command: 'RESUME' })"
      @resetGame="toggleTimer({ command: 'RESET' })"
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
     let timeInSeconds = getCurrentTimeInSeconds(localStorage.getItem("currentTime"));
     
    if (timeInSeconds>0) {
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
        setLocalStorageValues("currentMoves",this.countValue)
        
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
    // function to handle start , resume, play and reset events
    toggleTimer(operation) {
      if (operation.command == "START") {
        const timeInSeconds =
          new Date().getMinutes() * 60 + new Date().getSeconds();

        this.timeInterval = setInterval(() => {
          const newDate = new Date();

          const newTime = newDate.getMinutes() * 60 + newDate.getSeconds();

          const currentTime = newTime - timeInSeconds;
          this.Time = getTimerValue(currentTime);
        }, 1000);
        this.startGame = false;
        this.pauseGame = true;
        this.boardCoverShowProp = false;
      } else if (operation.command == "PAUSE") {
        clearInterval(this.timeInterval);
        this.startGame = false;
        this.pauseGame = false;
        this.resumeGame = true;
        this.boardCoverShowProp = true;
      } else if (operation.command == "RESUME") {
        let currentTimeInSeconds = getCurrentTimeInSeconds(this.Time);
        currentTimeInSeconds++;
        this.resumeGame = false;
        this.pauseGame = true;
        this.startGame = false;
        this.boardCoverShowProp = false;
        this.timeInterval = setInterval(() => {
          this.Time = getTimerValue(currentTimeInSeconds);
          currentTimeInSeconds++;
        }, 1000);
      } else if (operation.command == "RESET") {
       
        clearInterval(this.timeInterval);
        this.Time = "00:00";
        setLocalStorageValues("currentTime", this.Time);
        this.startGame = true;
        this.pauseGame = false;
        this.resumeGame = false;
        this.resetGame = true;
        this.boardCoverShowProp = true;
        this.countValue = 0;
        setLocalStorageValues("currentMoves", this.countValue);
      }
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

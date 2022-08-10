<template>
  <div class="Game_screen_board-container">
    <div class="Game_screen_board-container_board">
      <div
        class="Game_screen_board-container_board_row"
        v-for="i in 4"
        :key="i"
      >
        <button
          v-for="num in this.giverange(i)"
          :key="num"
          @click="clickedBlock($event, +num)"
          :value="puzzleArray[num]"
          :style="{ backgroundColor: this.backgroundMap.get(+num)['color'] }"
        >
          {{ puzzleArray[num] }}
        </button>
      </div>
    </div>
    <div
      class="Game_screen_board-container_board-cover"
      v-show="boardCoverShow"
      @click="$emit('boardCoverClicked')"
    >
      {{ boardDisplayText }}
    </div>
  </div>
</template>

<script>
import { setLocalStorageValues } from "../Mixins/setLocalStorageValues";
import { getCurrentTimeInSeconds } from "@/Mixins/getCurrentTimeInSeconds";
export default {
  name: "Board",
  emits: ["boardCoverClicked", "updateCounter", "resetGame"],

  components: {},
  data() {
    return {
      puzzleArray: [],
      backgroundMap: new Map(),
      resetBoard: false,
      movesCount: 0,
      boardCoverShow: true,
      boardDisplayText: "PLAY",
    };
  },
  props: ["reset", "boardCoverShowToggle", "timeValue"],

  beforeMount() {
  
    let timeInSeconds = getCurrentTimeInSeconds(this.timeValue);
    // check if the game is in a state which can be resumed or not
    if (timeInSeconds > 0) {
      // if the game is in a state from where it can be resumed
      this.puzzleArray = localStorage
        .getItem("currentPositions")
        .split(",")
        .slice(0, 17); // this will give us an array from local storage which conatins an empty space value instead of null
      const index = this.puzzleArray.indexOf("");
      this.puzzleArray[index] = null; // this will replace that empty space value with null value as we have it in our initial puzzleArray
      this.changeBackground();
      
      this.movesCount = +localStorage.getItem("currentMoves");
      this.boardDisplayText = "PAUSED";
    } else {
      this.giveSolvablePuzzle();
      this.changeBackground();
      this.movesCount = 0;

      setLocalStorageValues("currentPositions", this.puzzleArray);
    }
  
  },

  watch: {
    // watch if the reset button is clicked and do the nescessary changes
    reset(newValue) {
      this.giveSolvablePuzzle();
      this.changeBackground();
      setLocalStorageValues("currentPositions", this.puzzleArray);
      this.movesCount = 0;
      this.boardCoverShow = true;
      this.boardDisplayText = "PLAY";
    },
    // display and hide the board cover according to the state of the game
    boardCoverShowToggle(newValue) {
      this.boardCoverShow = newValue;
      this.boardDisplayText = "PAUSED";
    },

    // whenever swapping happens check if the puzzle is solved or not
    puzzleArray: {
      handler() {
        if (this.isPuzzleSorted(this.puzzleArray)) {
          alert(
            `Congratulations !! You finished the Puzzle in ${localStorage.getItem(
              "currentTime"
            )} time and ${localStorage.getItem("currentMoves")} moves`
          );
          this.$emit("resetGame");
        }
      },
      deep: true,
    },
  },

  methods: {
    giverange(start) {
      console.log(start);
      let rangeArray = [];
      for (let i = 4 * (start - 1); i <= 4 * start - 1; i++) {
        rangeArray.push(i);
      }
      return rangeArray;
    },
    // Function that gives  a solvable puzzle
    giveSolvablePuzzle() {
      let newArray = this.giveRandomPuzzle();
      let isSolvable = this.checkForValidity(newArray);

      while (!isSolvable) {
        newArray = this.giveRandomPuzzle();
        isSolvable = this.checkForValidity(newArray);
      }

      this.puzzleArray = newArray.slice(0, 17);
    },

    // function that give a random puzzle of 15 numbered blocks and an empty block
    giveRandomPuzzle() {
      let arrayHelper = [];
      const helper = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null];

      while (helper.length) {
        const randomNum = Math.floor(Math.random() * 17);
        if (helper[randomNum] === undefined) {
          continue;
        } else {
          arrayHelper.push(helper[randomNum]);
        }

        helper.splice(randomNum, 1);
      }
      return arrayHelper;
    },
    // function to check for validity of the puzzle
    checkForValidity(puzzleArray) {
      const inversionCount = this.getInversionCount(puzzleArray);

      const positionOfEmptyBlock =
        Math.ceil((puzzleArray.indexOf(null) + 1) / 4) * 4;

      if ((positionOfEmptyBlock / 4) % 2 != 0 && inversionCount % 2 != 0) {
        return true;
      }
      return (positionOfEmptyBlock / 4) % 2 == 0 && inversionCount % 2 == 0
        ? true
        : false;
    },

    // function to get the inversion count of the puzzle
    getInversionCount(puzzleArray) {
      let inversionCount = 0;
      for (let value = 0; value < puzzleArray.length; value++) {
        for (
          let nextvalue = value + 1;
          nextvalue < puzzleArray.length;
          nextvalue++
        ) {
          if (
            puzzleArray[value] != null &&
            puzzleArray[nextvalue] != null &&
            puzzleArray[value] > puzzleArray[nextvalue]
          ) {
            inversionCount++;
          }
        }
      }
      return inversionCount;
    },
    // function that changes the background of the blocks according to their positions
    changeBackground() {
      let color;
      for (let i = 0; i < this.puzzleArray.length; i++) {
        if (i + 1 == this.puzzleArray[i]) {
          color = "green";
        } else if (this.puzzleArray[i] == null) {
          color = "brown";
        } else {
          color = "yellow";
        }
        this.backgroundMap.set(i, { value: this.puzzleArray[i], color: color });
      }
    },

    clickedBlock(event, value) {
    

      this.checkForEmptyBlock(value);
    },

    // function to check for an empty block at different positions
    checkForEmptyBlock(index) {
      let clickedBlockPosition = index + 1; // position of the clicked block in the puzzleArray
      let clickedBlockRightPosition = clickedBlockPosition + 1; // position of the element just before the clicked block in the puzzleArray
      let clickedBlockLeftPosition = clickedBlockPosition - 1; // position of the element just after the clicked block in the puzzleArray
      let clickedBlockTopPosition = clickedBlockPosition - 4; // position of the element 4 indexes behind the clicked block in the puzzleArray
      let clickedBlockBottomPosition = clickedBlockPosition + 4; // position of the element 4 indexes after the clicked block in the puzzleArray

      // if any block is out of range for swapping we will not consider that block and make its value -1
      if (clickedBlockPosition % 4 == 0) {
        // if clicked block is in the extreme right column then we cannot swap it with the block just after it in the puzzleArray so the block to its right position is not considered
        clickedBlockRightPosition = -1;
      } else if ((clickedBlockPosition - 1) % 4 == 0) {
        // if clicked block is in the extreme left column then we cannot swap it with the block just before it in the puzzleArray so the block to its left position is not considered
        clickedBlockLeftPosition = -1;
      } else if (clickedBlockTopPosition <= 0) {
        // if clicked block is in the top row then we cannot swap it with the block 4 indexes before it in the puzzleArray so the block to its top position is not considered
        clickedBlockTopPosition = -1;
      } else if (clickedBlockBottomPosition > 16) {
        // if clicked block is in the bottom row then we cannot swap it with the block 4 indexes after it in the puzzleArray so the block to its bottom position is not considered
        clickedBlockBottomPosition = -1;
      }

      // check if there is an empty block to the right,left,top or bottom of the clicked block and then swap it with the clicked block
      if (
        clickedBlockLeftPosition > 0 &&
        this.isEmptyBlock(clickedBlockLeftPosition)
      ) {
        // swap the clicked block with the left block
        this.swapWithEmptyBlock(clickedBlockPosition, clickedBlockLeftPosition);
      } else if (
        clickedBlockRightPosition > 0 &&
        this.isEmptyBlock(clickedBlockRightPosition)
      ) {
        // swap the clicked block with the right block
        this.swapWithEmptyBlock(
          clickedBlockPosition,
          clickedBlockRightPosition
        );
      } else if (
        clickedBlockTopPosition > 0 &&
        this.isEmptyBlock(clickedBlockTopPosition)
      ) {
        // swap the clicked block with the top block
        this.swapWithEmptyBlock(clickedBlockPosition, clickedBlockTopPosition);
      } else if (
        clickedBlockBottomPosition &&
        this.isEmptyBlock(clickedBlockBottomPosition)
      ) {
        // swap the clicked block with the bottom block
        this.swapWithEmptyBlock(
          clickedBlockPosition,
          clickedBlockBottomPosition
        );
      } else {
        return;
      }
    },
    // function to check if the given position contains a null value
    isEmptyBlock(position) {
      if (this.puzzleArray.indexOf(null) == position - 1) {
        return true;
      } else {
        return false;
      }
    },

    // function to swap the clicked block with empty block
    swapWithEmptyBlock(clickedBlockPosition, emptyBlockPosition) {
      clickedBlockPosition -= 1; // get index of clicked block in the puzzleArray
      emptyBlockPosition -= 1; // get index of empty block in the puzzleArray

      // if after swapping the swapped block comes to its correct position then its background changes to green colour else it remains yellow
      if (emptyBlockPosition + 1 == this.puzzleArray[clickedBlockPosition]) {
        // if the swapped block comes to its correct position
        this.backgroundMap.set(emptyBlockPosition, {
          value: this.puzzleArray[clickedBlockPosition],
          color: "green",
        });
      } else {
        // if the swapped block doesn't come to its correct position
        this.backgroundMap.set(emptyBlockPosition, {
          value: this.puzzleArray[clickedBlockPosition],
          color: "yellow",
        });
      }

      // change the background of new empty block to brown
      this.backgroundMap.set(clickedBlockPosition, {
        value: null,
        color: "brown",
      });

      // swapping the elements in the puzzleArray
      const a = this.puzzleArray[clickedBlockPosition];
      const b = this.puzzleArray[emptyBlockPosition];
      this.puzzleArray[clickedBlockPosition] = b;
      this.puzzleArray[emptyBlockPosition] = a;

      // update the new values in localStorage and Screen component
      setLocalStorageValues("currentPositions", this.puzzleArray);
      this.movesCount++;
      setLocalStorageValues("currentMoves", this.movesCount);

      // emit to update the counter value in the Screen component
      this.$emit("updateCounter", this.movesCount);
    },

    // function to check if the  puzzleArray is sorted or not
    isPuzzleSorted(puzzleArray) {
      for (let i = 0; i < puzzleArray.length - 2; i++) {
        if (+puzzleArray[i] > +puzzleArray[i + 1]) {
          return false;
        }
      }
      return true;
    },
  },
};
</script>

<style scoped>
button {
  display: flex;
  padding: 2px;
  border: 2px solid black;
  height: 84px;
  width: 84px;
  margin: 5px;
  align-items: center;
  justify-content: center;
  font-size: 18pt;
  font-weight: bold;
  cursor: pointer;
  border-radius: 25px;
}
.Game_screen_board-container {
  position: relative;
  margin: 20px;
  height: 400px;
}
.Game_screen_board-container_board {
  height: 380px;
  max-width: 380px;
  position: absolute;
  top: 0px;
  bottom: 0px;
  padding: 10px;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  border: 3px solid black;
  border-radius: 25px;
}
.Game_screen_board-container_board-cover {
  height: 400px;
  max-width: 400px;
  position: absolute;
  top: 0px;
  bottom: 0px;

  background-color: rgb(11, 56, 11);
  opacity: 80%;
  color: white;
  font-size: 500%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 2px solid black;
  border-radius: 25px;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
}
.Game_screen_board-container_board_row {
  display: flex;
}
</style>

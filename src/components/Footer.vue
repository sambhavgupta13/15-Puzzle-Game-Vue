<template>
  <div class="Game_footer">
    <p>
      <b>Instructions</b> : Place each block in it's correct position starting
      from <b>1 to 15</b>.To move a block you can <b>click</b> on it and swap it
      with the empty block.
    </p>
  </div>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style scoped>
p {
  height: 200px;
  max-width: 450px;
  margin-left: auto;
  margin-right: auto;
  left: 10px;
  right: 0;
 color: black;

  text-align: left;
  font-size: 17pt;
  word-spacing: -6px;
}
</style>

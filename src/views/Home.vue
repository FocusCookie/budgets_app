<template>
  <div id="homeContainer" class="px-3 py-1">
    <transition-group
      name="list"
      tag="ul"
      class="pa-0"
      style="list-style-type:none;"
    >
      <li v-for="(item, index) in items" :key="index">
        <Expenses />
      </li>
    </transition-group>
  </div>
</template>

<script>
// @ is an alias to /src
import Expenses from "@/components/Expenses";

export default {
  name: "Home",
  components: {
    Expenses,
  },
  data() {
    return {
      items: [],
      itemsData: [1, 2, 3, 4, 5, 6, 7, 8],
    };
  },
  computed: {},
  created() {
    const self = this;

    let interval = setInterval(function() {
      self.items.push(2);
      if (self.items.length >= self.itemsData.length) {
        clearInterval(interval);
      }
    }, 40);
  },
};
</script>

<style scoped>
#homeContainer {
  background: #eff0f6;
}

.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active,
.list-leave-active {
  transition: all 300ms;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(-400px) opacity(100);
}
</style>

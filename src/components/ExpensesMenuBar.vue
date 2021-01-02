<template>
  <div id="expensesMenuBarContainer">
    <ExpensesTab
      :options="leftExpensesTabOptions"
      :status="leftTabStatus"
      @click="changeType"
    />

    <div class="addBtnContainer" @click="addExpense">
      <v-icon color="primary" large>
        mdi-bookmark-plus-outline
      </v-icon>
    </div>

    <ExpensesTab
      :options="rightExpensesTabOptions"
      :status="rightTabStatus"
      @click="changeType"
    />
  </div>
</template>

<script>
import ExpensesTab from "@/components/ExpensesTab";

export default {
  name: "ExpensesMenuBar",
  components: {
    ExpensesTab,
  },
  data() {
    return {
      leftExpensesTabOptions: { side: "left", title: "spontaneous" },
      leftTabStatus: true,
      rightExpensesTabOptions: { side: "right", title: "monthly" },
      rightTabStatus: false,
    };
  },
  computed: {},
  created() {},
  methods: {
    changeType(e) {
      if (e.side === "left") {
        this.leftTabStatus = true;
        this.rightTabStatus = false;
      } else {
        this.leftTabStatus = false;
        this.rightTabStatus = true;
      }

      this.$emit("typeChange", this.leftTabStatus ? "spontaneous" : "monthly");
    },
    addExpense() {
      this.$emit("addExpense", true);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#expensesMenuBarContainer {
  background: #f7f7fc;
  border-top: 1px solid #d6d8e7;
  display: grid;
  grid-template-columns: 3fr 1fr 3fr;
  grid-template-rows: 100%;
  align-items: center;
  justify-items: center;
  height: 55px;
}

.addBtnContainer {
  border-left: 1px solid #d6d8e7;
  border-right: 1px solid #d6d8e7;
  height: 100%;
  width: 100%;
  display: grid;
  align-items: center;
  justify-items: center;
}
</style>

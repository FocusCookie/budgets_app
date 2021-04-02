<template>
  <div id="expensesMenuBarContainer">
    <ExpensesTab
      :options="leftExpensesTabOptions"
      :status="leftTabStatus"
      @click="changeType"
    />

    <div class="backBtnContainer" @click="back">
      <v-icon :color="options.iconColor" large>
        mdi-backburger
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
  name: "AnalyticsMenuBar",
  components: {
    ExpensesTab,
  },
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          iconColor: "secondary",
        };
      },
    },
  },
  data() {
    return {
      leftExpensesTabOptions: { side: "left", title: "percentage" },
      leftTabStatus: true,
      rightExpensesTabOptions: { side: "right", title: "euro" },
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

      this.$emit("typeChange", this.leftTabStatus ? "percentage" : "euro");
    },
    back() {
      this.$emit("back", true);
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

.backBtnContainer {
  border-left: 1px solid #d6d8e7;
  border-right: 1px solid #d6d8e7;
  height: 100%;
  width: 100%;
  display: grid;
  align-items: center;
  justify-items: center;
}
</style>

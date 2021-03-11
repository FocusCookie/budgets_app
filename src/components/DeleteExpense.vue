<template>
  <v-dialog v-model="display" fluid>
    <v-card
      v-click-outside="closeDialog"
      class="pa-4 d-flex align-content-space-around flex-wrap rounded-lg text-center justify-center"
    >
      <v-card-title class="pa-0 pb-2 font-weight-bold text-h6 text-uppercase">
        Delete {{ sellingPoint.name }}
      </v-card-title>
      <v-card-text
        outlined
        class="elevation-0 rounded-lg pa-0"
        color="primary"
        dark
      >
        <span
          >Are you sure that you want to delete the
          <span class="font-weight-bold text-uppercase">{{
            sellingPoint.name
          }}</span>
          expense from
          <span class="font-weight-bold">{{ dateCreated }}</span>
          with the sum of
          <span class="font-weight-bold">{{ expense.sum }} €</span>?</span
        >
      </v-card-text>

      <div class="pa-0 pt-4 d-flex justify-space-around" style="width:100%">
        <v-btn color="error" rounded outlined @click="deleteExpense">
          Delete
        </v-btn>

        <v-btn rounded color="primary" class="elevation-0" @click="closeDialog">
          Cancel
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from "moment";

export default {
  name: "DeleteExpense",
  validations: {},
  components: {},
  props: {
    expense: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      display: true,
    };
  },
  computed: {
    dateCreated() {
      return moment(this.expense.dateCreated).format("DD. MMM - HH:mm");
    },
    sellingPoint() {
      return this.$store.getters["sellingPoints/all"].find(
        sp => sp._id === this.expense.sellingPoint,
      );
    },
  },
  created() {},
  methods: {
    closeDialog() {
      this.$emit("canceled", true);
    },
    async deleteExpense() {
      try {
        this.deleting = true;

        await this.$store.dispatch("expenses/delete", this.expense._id);

        this.$emit("deleted", this.expense);

        this.deleting = false;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>

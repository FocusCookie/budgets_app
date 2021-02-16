<template>
  <v-dialog
    v-model="display"
    content-class="ma-0 px-3 rounded-0"
    fluid
    persistent
    transition="dialog-bottom-transition"
    scrollable
  >
    <v-card class="text-left rounded-xl">
      <v-card-title
        class="headline white--text font-weight-bold text-h6 pa-2 text-uppercase"
      >
        EDIT {{ sellingPoint.name }}
      </v-card-title>
      <v-card-text class="py-3 px-0 text-overline">
        <div class="px-3">
          <div class="typeContainer pa-1 " @click="spontaneous = !spontaneous">
            <div
              :class="
                `typeSlider primary text-center white--text text-button ${
                  spontaneous ? '' : 'sliderMoveRight'
                }`
              "
            >
              {{ spontaneous ? "spontaneous" : "monthly" }}
            </div>
          </div>

          <v-text-field
            v-model="sum"
            small
            class="py-4"
            color="primary"
            label="SUM"
            rounded
            outlined
            dense
            hide-details
            type="number"
            append-icon="mdi-currency-eur"
            :error="enteredSumError"
            :rules="[rules.required]"
            @input="updateSum"
          />

          <v-select
            v-model="selectedSellingPoint"
            :items="sellingPointsToSelect"
            label="Selling Point"
            rounded
            outlined
            dense
            hide-details
            :error="selectedSellingPointError"
            :rules="[rules.required]"
            @input="selectSellingPoint"
          />
        </div>

        <div
          v-if="selectedSellingPoint === newSellingPointCreationText"
          class="mt-3 px-4 createSellingPointWrapper primary--text text-center"
        >
          <span class="text-overline font-weight-bold">NEW SELLING POINT</span>
          <v-text-field
            v-model="enteredSellingPointName"
            small
            color="primary"
            label="Name"
            placeholder="enter a name"
            rounded
            hide-details
            outlined
            dense
            maxlength="50"
            :error="enteredSellingPointNameError"
            :rules="[
              rules.required,
              rules.minSellingPointName,
              rules.maxSellingPointName,
            ]"
            @input="enterSellingPointName"
          />
          <v-text-field
            v-model="enteredSellingPointInitials"
            small
            class="py-3"
            color="primary"
            label="Initials"
            rounded
            hide-details
            outlined
            dense
            maxlength="2"
            :error="enteredSellingPointInitalsError"
            :rules="[
              rules.required,
              rules.minSellingPointInitials,
              rules.maxSellingPointInitials,
            ]"
            @input="enterSellingPointInitials"
          />

          <v-card id="customBorder" outlined class="pa-0 rounded-lg">
            <v-color-picker
              v-model="color"
              class="colorPicker"
              hide-inputs
              width="320px"
            />
          </v-card>

          <v-select
            :items="sellingPointCategories"
            label="Category"
            class="py-3"
            rounded
            outlined
            dense
            hide-details
            :error="selectedSellingPointCategoryError"
            :rules="[rules.required]"
            @input="selectSellingPointCategory"
          />
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4 d-flex justify-space-between">
        <v-btn rounded color="primary" outlined text @click="cancelEdit">
          Cancel
        </v-btn>

        <v-btn
          rounded
          color="secondary"
          text
          @click="deleteDialog = !deleteDialog"
        >
          Delete
        </v-btn>

        <v-btn color="primary" rounded dark :loading="deleting" @click="save">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- DELETE DIALOG -->
    <v-dialog
      v-model="deleteDialog"
      content-class="ma-0 px-3 rounded-0"
      fluid
      scrollable
    >
      <v-card class="text-left rounded-xl">
        <v-card-title
          class="deleteHeadline white--text font-weight-bold text-h6 pa-2 text-uppercase"
        >
          🚨 Delete {{ sellingPoint.name }}
        </v-card-title>

        <v-card-text class="pa-3 body-1 black--text">
          Are you sure that you want to delete the expense for
          {{ sellingPoint.name }} with {{ expense.sum }}?
        </v-card-text>

        <v-card-actions class="pa-4 d-flex justify-space-between">
          <v-btn
            color="error"
            rounded
            dark
            :loading="deleting"
            @click="deleteExpense"
          >
            Delete
          </v-btn>

          <v-btn rounded color="primary" @click="deleteDialog = !deleteDialog">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
export default {
  name: "EditExpenseDialog",
  props: ["expense", "sellingPoint", "display"],
  data() {
    return {
      newSellingPointCreationText: "create new selling point",
      spontaneous: true,
      enteredSellingPointInitials: "",
      enteredSellingPointName: "",
      selectedSellingPointCategory: "",
      sellingPointColor: "primary",
      selectedSellingPoint: "",
      enteredSumError: false,
      selectedSellingPointError: false,
      selectedSellingPointCategoryError: false,
      enteredSellingPointNameError: false,
      enteredSellingPointInitalsError: false,
      sum: 0,
      rules: {
        required: value => !!value || "Required.",
        min: v => v.length >= 1 || "Min 1 character.",
        minSellingPointInitials: v => v.length >= 1 || "Min 1 character.",
        minSellingPointName: v => v.length >= 2 || "Min 2 character.",
        maxSellingPointInitials: v => v.length <= 2 || "Max 2 characters.",
        maxSellingPointName: v => v.length <= 50 || "Max 50 characters.",
      },
      type: "hex",
      hex: "#673AB7",
      expenseBeforeEdit: null,
      deleting: false,
      deleteDialog: false,
      saving: false,
    };
  },
  computed: {
    color: {
      get() {
        return this.type;
      },
      set(v) {
        this.type = v;
      },
    },
    showColor() {
      if (typeof this.color === "string") return this.color;

      return JSON.stringify(
        Object.keys(this.color).reduce((color, key) => {
          color[key] = Number(this.color[key].toFixed(2));
          return color;
        }, {}),
        null,
        2,
      );
    },
    sellingPointsToSelect() {
      const sellingPoints = this.$store.getters["sellingPoints/all"];
      if (sellingPoints.length > 0) {
        let result = sellingPoints.map(sp => sp.name);

        result.push(this.newSellingPointCreationText);
        return result;
      } else {
        return this.newSellingPointCreationText;
      }
    },
    sellingPointCategories() {
      const categoriesObj = this.$store.getters["categories/all"];

      let categories = [];

      for (let cat in categoriesObj) {
        categories.push(categoriesObj[cat].title);
      }

      return categories;
    },
    categories() {
      return this.$store.getters["categories/all"];
    },
  },
  created() {
    this.expenseBeforeEdit = { ...this.expense };

    this.sum = this.expense.sum;
    this.selectedSellingPoint = this.sellingPoint.name;
    this.type = this.expense.type;

    this.spontaneous = this.expense.type === "spontaneous" ? true : false;
  },
  methods: {
    updateSum(v) {
      this.enteredSumError = false;
      this.sum = v;
    },
    enterSellingPointName(value) {
      this.enteredSellingPointNameError = false;
      this.enteredSellingPointName = value;
    },
    enterSellingPointInitials(value) {
      this.enteredSellingPointInitalsError = false;
      this.enteredSellingPointInitials = value;
    },
    selectSellingPointCategory(value) {
      this.selectedSellingPointCategoryError = false;
      this.selectedSellingPointCategory = value;
    },
    selectSellingPoint(value) {
      this.selectedSellingPointError = false;
      this.selectedSellingPoint = value;
    },
    selectSellingPointCategorie(value) {
      this.selectedSellingPointCategoryError = false;
      this.selectedSellingPointCategory = value;
    },
    async save() {
      try {
        this.saving = true;

        let newSellingPointCreated = false;
        let foundInputError = false;
        let foundInputErrorForNewSellingPoint = false;
        // If there is no input from the user block the creation
        if (this.sum === 0) {
          this.enteredSumError = true;
          foundInputError = true;
        }
        if (this.selectedSellingPoint === "") {
          this.selectedSellingPointError = true;
          foundInputError = true;
        }

        // only check if the user wants to create a new selling point, the last item of the sellingPointCategories is "create new selling point"
        if (this.selectedSellingPoint === this.newSellingPointCreationText) {
          if (this.selectedSellingPointCategory === "") {
            this.sellingPointCategoryError = true;
            foundInputErrorForNewSellingPoint = true;
          }
          if (this.enteredSellingPointName === "") {
            this.enteredSellingPointNameError = true;
            foundInputErrorForNewSellingPoint = true;
          }
          if (this.enteredSellingPointInitials === "") {
            this.enteredSellingPointInitalsError = true;
            foundInputErrorForNewSellingPoint = true;
          }
          if (this.selectedSellingPointCategory === "") {
            this.selectedSellingPointCategoryError = true;
            foundInputErrorForNewSellingPoint = true;
          }
        }

        if (
          !foundInputErrorForNewSellingPoint &&
          this.selectedSellingPoint === this.newSellingPointCreationText
        ) {
          newSellingPointCreated = await this.$store.dispatch(
            "sellingPoints/add",
            {
              name: this.enteredSellingPointName,
              initials: this.enteredSellingPointInitials,
              category: this.categories.find(
                cat => cat.title === this.selectedSellingPointCategory,
              ).title,
              color: this.type,
            },
          );
        }

        const expense = {
          sum: this.sum,
          type: this.spontaneous ? "spontaneous" : "monthly",
          sellingPoint: newSellingPointCreated
            ? newSellingPointCreated._id
            : this.$store.getters["sellingPoints/all"].find(
                sp => sp.name === this.selectedSellingPoint,
              )._id,
          _id: this.expenseBeforeEdit._id,
        };

        // add in the if the return of the new selling point post await
        if (!foundInputError && !foundInputErrorForNewSellingPoint) {
          if (
            this.expenseBeforeEdit.sum !== expense.sum ||
            this.expenseBeforeEdit.type !== expense.type ||
            this.expenseBeforeEdit.sellingPoint !== expense.sellingPoint
          ) {
            const editedExpense = await this.$store.dispatch(
              "expenses/edit",
              expense,
            );

            this.$emit("saved", editedExpense);
          } else {
            this.$emit("saved", false);
          }
        }

        this.saving = false;
      } catch (error) {
        this.saving = false;
        console.log(error);
      }
    },
    cancelEdit() {
      this.$emit("canceled", true);
    },
    async deleteExpense() {
      try {
        this.deleting = true;

        const expensesWithoutDeletedExpense = await this.$store.dispatch(
          "expenses/delete",
          this.expense._id,
        );

        this.$emit("deleted", expensesWithoutDeletedExpense);

        this.deleting = false;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.headline {
  background: var(--v-primary-base);
  display: flex;
  justify-content: center;
}

.deleteHeadline {
  background: var(--v-error-base);
  display: flex;
  justify-content: center;
}

.typeContainer {
  border: 1px solid var(--v-secondary-base);
  border-radius: 100px;
  display: block;
  height: 40px;
  width: 100%;
}

.headlineCenter {
  justify-content: center;
}

.typeSlider {
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 50%;
  transition: all 250ms ease-in-out;
}
.buttonsWrapper {
  display: flex;
  justify-content: space-between;
}

.createSellingPointWrapper {
  border-top: 2px solid var(--v-primary-base);
  border-bottom: 2px solid var(--v-primary-base);
}

.sliderMoveRight {
  margin-left: 50%;
}

.colorPicker {
  width: 100%;
}

#customBorder {
  border-color: var(--v-secondary-base);
}
</style>

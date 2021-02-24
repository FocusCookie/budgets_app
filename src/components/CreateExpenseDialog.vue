<template>
  <v-dialog
    v-model="open"
    content-class=""
    fluid
    fullscreen
    transition="dialog-bottom-transition"
    scrollable
  >
    <v-card class="text-left rounded-xl">
      <v-card-title
        class="headline white--text font-weight-bold text-h6 pa-2 text-uppercase"
      >
        Create a new Expense
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

          <div
            v-if="!spontaneous"
            class="d-flex justify-space-between align-center mt-3"
          >
            <span class="pl-4">Recurring</span>
            <v-switch v-model="recurring" hide-details class="ma-0" inset />
          </div>

          <v-row v-if="recurring" justify="center" class="pa-3 mt-1">
            <v-dialog
              ref="dialog"
              v-model="recurringLastMonthmodal"
              :return-value.sync="recurringLastMonth"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="recurringLastMonth"
                  :error="recurringLastMonthError"
                  :rules="recurring ? [rules.required] : []"
                  dense
                  hide-details
                  outlined
                  rounded
                  label="last Month of recurring the expense"
                  append-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="recurringLastMonth"
                color="primary"
                type="month"
                :min="nextMonth"
                scrollable
              >
                <v-btn
                  color="secondary"
                  text
                  @click="recurringLastMonthmodal = false"
                >
                  Cancel
                </v-btn>

                <v-spacer />

                <v-btn
                  color="primary"
                  rounded
                  @click="$refs.dialog.save(recurringLastMonth)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-dialog>
          </v-row>

          <v-text-field
            small
            class="py-4"
            color="primary"
            label="SUM"
            placeholder="0.00"
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

      <v-card-actions class="pa-4">
        <v-btn rounded color="primary" outlined @click="cancelCreation">
          Cancel
        </v-btn>

        <v-spacer />

        <v-btn color="primary" rounded dark @click="createExpense">
          Create expense
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "CreateExpenseDialog",
  data() {
    return {
      newSellingPointCreationText: "create new selling point",
      open: true,
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
      recurringLastMonthError: false,
      sum: 0,
      recurring: false,
      recurringLastMonth: "",
      recurringLastMonthmodal: false,
      rules: {
        required: value => !!value || "Required.",
        min: v => v.length >= 1 || "Min 1 character.",
        minSellingPointInitials: v => v.length >= 1 || "Min 1 character.",
        maxSellingPointInitials: v => v.length <= 2 || "Max 2 characters.",
        minSellingPointName: v => v.length >= 2 || "Min 2 character.",
        maxSellingPointName: v => v.length <= 50 || "Max 50 characters.",
      },
      type: "hex",
      hex: "#673AB7",
    };
  },
  computed: {
    color: {
      get() {
        return this[this.type];
      },
      set(v) {
        this[this.type] = v;
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
        return [this.newSellingPointCreationText];
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
    nextMonth() {
      const today = new Date();

      return `${today.getFullYear()}-${today.getMonth() + 1}`;
    },
  },
  watch: {
    recurringLastMonth(v) {
      v !== "" ? (this.recurringLastMonthError = false) : false;
    },
  },
  created() {},
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
    async createExpense() {
      try {
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

        // if expense is recurring
        if (this.recurringLastMonth === "" && this.recurring) {
          this.recurringLastMonthError = true;
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
              color: this.hex,
            },
          );
        }

        // add in the if the return of the new selling point post await
        if (!foundInputError && !foundInputErrorForNewSellingPoint) {
          let expense = {
            sum: this.sum,
            type: this.spontaneous ? "spontaneous" : "monthly",
            sellingPoint: newSellingPointCreated
              ? newSellingPointCreated._id
              : this.$store.getters["sellingPoints/all"].find(
                  sp => sp.name === this.selectedSellingPoint,
                )._id,
            vault: this.$store.getters["vault/id"],
          };

          if (this.recurring) {
            expense.recurring = this.recurring;
            expense.recurringLastMonth = this.recurringLastMonth;
          }

          this.$store.dispatch("expenses/create", expense);

          this.$emit("created", true);
        }
      } catch (error) {
        console.log(error);
      }
    },
    cancelCreation() {
      this.$emit("cancel", false);
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

.buttonsContainer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: center;
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

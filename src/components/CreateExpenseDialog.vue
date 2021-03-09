<template>
  <v-dialog
    v-model="open"
    fluid
    fullscreen
    transition="dialog-bottom-transition"
    scrollable
  >
    <div class="wrapper pa-4">
      <!-- EXPENSE TYPE -->
      <div class="typeContainer" @click="spontaneous = !spontaneous">
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

      <!-- RECURRING -->
      <div
        v-if="!spontaneous"
        class="d-flex justify-space-between align-center"
        style="min-height:40px"
      >
        <div class="d-flex justify-space-between align-center">
          <v-switch
            v-model="recurring"
            hide-details
            class="ma-0 pa-0 pl-1"
            inset
          />
          <span
            class="font-weight-bold text-uppercase secondary--text text--darken-3"
            >Recurring</span
          >
        </div>

        <!-- REUCCIRING MONTH PICKER -->
        <div id="recurringWrapper">
          <v-dialog
            v-if="recurring"
            ref="dialog"
            v-model="recurringLastMonthmodal"
            :return-value.sync="recurringLastMonth"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                :color="recurringLastMonthError ? 'error' : 'primary'"
                class="rounded-lg elevation-0 font-weight-bold"
                width="120px"
                dark
                v-on="on"
              >
                <span v-if="recurringLastMonth === ''">until</span>
                {{ recurringLastMonth }}
                <v-icon class="ml-2">
                  mdi-calendar
                </v-icon>
              </v-btn>
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
        </div>
      </div>

      <div>
        <div v-if="!createNewSellingPoint">
          <SellingPointCarousel
            v-if="sellingPointsExist"
            @selected="setSellingPoint"
          />

          <v-btn
            v-if="sellingPointsExist && !createNewSellingPoint"
            class="mt-2"
            rounded
            small
            color="secondary lighten-1"
            outlined
            @click="createNewSellingPoint = true"
          >
            New Selling Point
          </v-btn>
        </div>

        <div v-if="createNewSellingPoint || !sellingPointsExist">
          <v-text-field
            v-model="enteredSellingPointName"
            small
            color="primary"
            label="Selling Point Name"
            placeholder="enter a selling point name"
            rounded
            outlined
            dense
            counter
            min-length="2"
            maxlength="50"
            :error="enteredSellingPointNameError"
            :rules="[
              rules.required,
              rules.minSellingPointName,
              rules.maxSellingPointName,
            ]"
            @input="enterSellingPointName"
          />

          <NativeSelect
            :items="sellingPointCategories"
            class="pb-2"
            label="Category"
            rounded
            dense
            outlined
            hide-details
            :error="selectedSellingPointCategoryError"
            :rules="[rules.required]"
            @input="selectSellingPointCategory"
          />

          <v-btn
            v-if="!sellingPointsExist && createNewSellingPoint"
            rounded
            small
            color="primary"
            outlined
            @click="createNewSellingPoint = false"
          >
            Cancel
          </v-btn>
        </div>
      </div>

      <SumNumpad :error="enteredSumError" @input="updateSum" />

      <!-- BUTTONS -->
      <div class="d-flex justify-space-between">
        <v-btn rounded color="secondary" large outlined @click="cancelCreation">
          Cancel
        </v-btn>

        <v-spacer />

        <v-btn
          color="success"
          class="elevation-0"
          rounded
          large
          dark
          @click="createExpense"
        >
          Create
        </v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script>
import SellingPointCarousel from "@/components/SellingPointCarousel";
import NativeSelect from "@/components/NativeSelect";
import SumNumpad from "@/components/SumNumpad";

export default {
  name: "CreateExpenseDialog",
  components: { SellingPointCarousel, SumNumpad, NativeSelect },
  data() {
    return {
      open: true,
      createNewSellingPoint: false,
      spontaneous: true,
      enteredSellingPointName: "",
      selectedSellingPointCategory: "",
      selectedSellingPoint: "",
      enteredSumError: false,
      selectedSellingPointError: false,
      selectedSellingPointCategoryError: false,
      enteredSellingPointNameError: false,
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
    };
  },
  computed: {
    sellingPointsExist() {
      const sellingPoints = this.$store.getters["sellingPoints/all"];
      return sellingPoints.length > 0 ? true : false;
    },
    sellingPointCategories() {
      const categoriesObj = this.$store.getters["categories/all"];

      let categories = [];

      for (let cat in categoriesObj) {
        categories.push(categoriesObj[cat].title);
      }

      return categories.sort();
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
  created() {
    if (!this.sellingPointsExist) this.createNewSellingPoint = true;
  },
  methods: {
    setSellingPoint(sp) {
      this.selectedSellingPoint = sp._id;
    },
    updateSum(v) {
      this.enteredSumError = false;
      this.sum = v;
    },
    enterSellingPointName(value) {
      this.enteredSellingPointNameError = false;
      this.enteredSellingPointName = value;
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
        if (this.selectedSellingPoint === "" && !this.createNewSellingPoint) {
          this.selectedSellingPointError = true;
          foundInputError = true;
        }

        // only check if the user wants to create a new selling point
        if (!this.sellingPointsExist || this.createNewSellingPoint) {
          if (this.selectedSellingPointCategory === "") {
            this.sellingPointCategoryError = true;
            foundInputErrorForNewSellingPoint = true;
          }
          if (this.enteredSellingPointName === "") {
            this.enteredSellingPointNameError = true;
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
          (!foundInputErrorForNewSellingPoint &&
            !this.sellingPointsExist &&
            this.sum !== 0) ||
          this.createNewSellingPoint
        ) {
          newSellingPointCreated = await this.$store.dispatch(
            "sellingPoints/add",
            {
              name: this.enteredSellingPointName,
              category: this.categories.find(
                cat => cat.title === this.selectedSellingPointCategory,
              ).title,
            },
          );
        }

        console.log("foundInputError", foundInputError);
        console.log(
          "foundInputErrorForNewSellingPoint",
          foundInputErrorForNewSellingPoint,
        );

        // add in the if the return of the new selling point post await
        if (!foundInputError && !foundInputErrorForNewSellingPoint) {
          let expense = {
            sum: this.sum,
            type: this.spontaneous ? "spontaneous" : "monthly",
            sellingPoint: newSellingPointCreated
              ? newSellingPointCreated._id
              : this.selectedSellingPoint,
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
    print(v) {
      console.log(v);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wrapper {
  background: #fff;
  height: 100%;
  width: 100%;
  display: grid;
  grid-auto-columns: 1fr;
  align-content: space-between;
}

#recurringWrapper {
  width: 120px;
}

.headline {
  background: var(--v-primary-base);
  display: flex;
  justify-content: center;
}

.typeContainer {
  border: 2px solid var(--v-primary-base);
  border-radius: 100px;
  display: block;
  height: 40px;
  width: 100%;
  padding: 2px;
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

#customBorder {
  border-color: var(--v-secondary-base);
}
</style>

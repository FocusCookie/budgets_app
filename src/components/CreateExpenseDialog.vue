<template>
  <v-dialog
    v-model="open"
    content-class="ma-0 px-3 rounded-0"
    fluid
    persistent
    transition="dialog-bottom-transition"
  >
    <v-card class="text-left">
      <v-card-title
        class="headlineCenter primary--text text-uppercase font-weight-bold  py-3  "
      >
        Create a new Expense
      </v-card-title>
      <v-card-text class="pa-0  text-overline">
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
            class="py-3"
            small
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
          class="mt-4 pb-3 pt-1 px-10 createSellingPointWrapper primary--text text-center"
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
            class="py-3"
            small
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

          <v-color-picker v-model="color" hide-inputs />

          <v-select
            :items="sellingPointCategories"
            label="Category"
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
      <div class="pa-4 text-center buttonsContainer">
        <v-btn x-small rounded color="error" text @click="cancelCreation">
          Cancel
        </v-btn>

        <v-btn x-small color="primary" rounded dark @click="createExpense">
          Create expense
        </v-btn>
      </div>
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
      sum: 0,
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
          const expense = {
            sum: this.sum,
            type: this.spontaneous ? "spontaneous" : "monthly",
            sellingPoint: newSellingPointCreated
              ? newSellingPointCreated._id
              : this.$store.getters["sellingPoints/all"].find(
                  sp => sp.name === this.selectedSellingPoint,
                )._id,
            vault: this.$store.getters["vault/id"],
          };

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

/* VUE OVERWRITE */

/* dialog to the bottom not in center */
.v-dialog__content {
  align-items: flex-end;
}
/* adjust corners of the card in the dialog */
.v-dialog .v-sheet.v-card {
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
}
</style>

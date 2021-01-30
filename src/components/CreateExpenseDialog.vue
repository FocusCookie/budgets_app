<template>
  <v-dialog
    v-model="open"
    content-class="ma-0 rounded-0"
    fluid
    persistent
    transition="dialog-bottom-transition"
  >
    <v-card class="text-left">
      <v-card-title
        class="headlineCenter text-uppercase font-weight-bold  py-3  "
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
            small
            v-model="enteredSellingPointName"
            color="primary"
            label="Name"
            placeholder="enter a name"
            rounded
            outlined
            dense
            maxlength="50"
            hide-details
            :error="enteredSellingPointNameError"
            :rules="[rules.required, rules.min]"
            @input="enterSellingPointName"
          />
          <v-text-field
            class="py-3"
            small
            color="primary"
            label="Initials"
            rounded
            outlined
            dense
            hide-details
            maxlength="2"
            :error="enteredSellingPointInitalsError"
            :rules="[
              rules.required,
              rules.minSellingPointInitials,
              rules.maxSellingPointInitials,
            ]"
            @input="enterSellingPointInitials"
          />
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
        <v-btn rounded color="error" text @click="cancelCreation">
          Cancel
        </v-btn>

        <v-btn color="primary" rounded dark @click="createExpense">
          Create expense
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "CreateExpenseDialog",
  props: ["sellingPoints", "sellingPointCategories"],
  data() {
    return {
      newSellingPointCreationText: "create new selling point",
      open: true,
      spontaneous: true,
      enteredSellingPointInitials: "",
      enteredSellingPointName: "",
      selectedSellingPointCategory: "",
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
    };
  },
  computed: {
    sellingPointsToSelect() {
      let result = this.sellingPoints.map(el => el);
      result.push(this.newSellingPointCreationText);
      return result;
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
    createExpense() {
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
        this.selectedSellingPoint ===
          this.sellingPointCategories[this.sellingPointCategories.length - 1]
      ) {
        // last item is create new one
        //TODO: API call to create the expense  and if new selling point first create selling point and than the expense
        console.log("API CALL TO CREATE A NEW SELLING POINT");
      }

      // add in the if the return of the new selling point post await
      if (!foundInputError) {
        console.log("API CALL FOR CREATING A NEW EXPENSE ");
        this.$emit("created", {
          type: this.spontaneous ? "spontaneous" : "monthly",
          sellingPoint: "IDSELLINGPOINT",
          sum: this.sum,
          vault: "VAULTID",
        });
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

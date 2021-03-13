<template>
  <div
    :class="`sumNumpadWrapper rounded-lg pa-2 ${error ? 'error-border' : ''}`"
  >
    <div class="sumWrapper text-right mb-2">
      <span class="text-h3 font-weight-bold"
        >{{ sumtext !== "" ? sumtext : "0" }} €</span
      >
    </div>
    <div class="numpadWrapper">
      <v-btn
        class="primary elevation-0 py-6 rounded-lg font-weight-bold text-h4"
        :disabled="disableNumKeys"
        @click="sumtext += 1"
      >
        1
      </v-btn>
      <v-btn
        class="primary elevation-0 py-6 rounded-lg font-weight-bold text-h4"
        :disabled="disableNumKeys"
        @click="sumtext += 2"
      >
        2
      </v-btn>
      <v-btn
        class="primary elevation-0 py-6 rounded-lg font-weight-bold text-h4"
        :disabled="disableNumKeys"
        @click="sumtext += 3"
      >
        3
      </v-btn>
      <v-btn
        class="primary elevation-0 py-6 rounded-lg font-weight-bold text-h4"
        :disabled="disableNumKeys"
        @click="sumtext += 4"
      >
        4
      </v-btn>
      <v-btn
        class="primary elevation-0 py-6 rounded-lg font-weight-bold text-h4"
        :disabled="disableNumKeys"
        @click="sumtext += 5"
      >
        5
      </v-btn>
      <v-btn
        class="primary elevation-0 py-6 rounded-lg font-weight-bold text-h4"
        :disabled="disableNumKeys"
        @click="sumtext += 6"
      >
        6
      </v-btn>
      <v-btn
        class="primary elevation-0 py-6 rounded-lg font-weight-bold text-h4"
        :disabled="disableNumKeys"
        @click="sumtext += 7"
      >
        7
      </v-btn>
      <v-btn
        class="primary elevation-0 py-6 rounded-lg font-weight-bold text-h4"
        :disabled="disableNumKeys"
        @click="sumtext += 8"
      >
        8
      </v-btn>
      <v-btn
        class="primary elevation-0 py-6 rounded-lg font-weight-bold text-h4"
        :disabled="disableNumKeys"
        @click="sumtext += 9"
      >
        9
      </v-btn>
      <v-btn
        class="primary elevation-0 py-6 rounded-lg font-weight-bold text-h4"
        @click="sumtext = ''"
      >
        C
      </v-btn>
      <v-btn
        class="primary elevation-0 py-6 rounded-lg font-weight-bold text-h4"
        :disabled="disableNumKeys"
        @click="sumtext += 0"
      >
        0
      </v-btn>
      <v-btn
        class="primary elevation-0 py-6 rounded-lg font-weight-bold text-h4"
        :disabled="sumtext.includes('.')"
        @click="sumtext += '.'"
      >
        .
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "SumKeypad",
  props: {
    error: {
      type: Boolean,
      default: false,
    },
    init: {
      type: Number,
      default: 0,
    },
  },
  data: () => ({
    sumtext: "",
  }),
  computed: {
    disableNumKeys() {
      return this.sumtext.includes(".")
        ? this.sumtext.split(".")[1].length >= 2
        : false;
    },
    sum() {
      return this.sumtext !== "" ? parseFloat(this.sumtext).toFixed(2) : 0;
    },
  },
  watch: {
    sum(value) {
      this.$emit("input", value);
    },
  },
  created() {
    if (this.init) this.sumtext = this.init.toString();
  },
  methods: {},
};
</script>
<style scoped>
.sumNumpadWrapper {
  border: 2px solid var(--v-primary-base);
}

.error-border {
  border: 2px solid var(--v-error-base);
}

.custom-line-height {
  line-height: 0px;
}

.numpadWrapper {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  grid-gap: 10px;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transform: translateY(10px);
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for <2.1.8 */ {
  transform: translateY(-10px);
  opacity: 0;
}
</style>

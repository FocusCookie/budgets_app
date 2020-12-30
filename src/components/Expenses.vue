<template>
  <div id="container" :class="`pa-3 mt-3 ${size ? 'expanded' : 'minified'}`">
    <div class="sellingPointInitials ">
      <span class="text-uppercase white--text font-weight-black">{{
        expenseToShow.sellingPoint.initials
      }}</span>
    </div>
    <div class="sellingPointIcon">
      <span class="text-h5">{{ expenseToShow.sellingPoint.icon }}</span>
    </div>

    <div
      :class="
        `expenseSum font-weight-bold ${
          expenseToShow.sum < 0 ? 'error--text' : 'success--text'
        }  ${size ? 'text-center text-h1' : 'text-right text-h4'}`
      "
    >
      {{ expenseToShow.sum }}
    </div>
    <div class="moreBtn text-right">
      <v-btn fab dark small color="primary" outlined @click="toogleSize">
        <v-icon dark>
          {{ size ? "mdi-chevron-up" : "mdi-chevron-down" }}
        </v-icon>
      </v-btn>
    </div>

    <div v-if="size" class="sellingPointCategoryAndName text-left">
      <span
        class="text-overline pa-0 mb-0  font-weight-bold secondary--text text--lighten-2"
        >{{ expenseToShow.sellingPoint.category }}
      </span>
      <p
        v-if="size"
        class="sellingPointName text-body-4 text-uppercase font-weight-bold pa-0 ma-0"
      >
        {{ expenseToShow.sellingPoint.name }}
      </p>
    </div>

    <div v-if="size" class="receiptsImages">
      <span
        class=" text-overline secondary--text text--lighten-3 font-weight-black"
        >Receipts</span
      >
      <v-img
        v-for="(image, index) in expenseToShow.images"
        :key="index"
        class="mt-3 rounded-lg"
        :src="image.url"
      />
    </div>
    <div v-if="size" class="comments ">
      <span
        class="text-overline secondary--text text--lighten-3 font-weight-black"
        >Comments</span
      >
      <v-card
        v-for="(comment, index) in expenseToShow.comments"
        :key="index"
        class="rounded-lg mt-3 pa-0"
        outlined
        tile
      >
        <v-card-text
          :class="
            `pa-3 text-body-1 font-italic ${
              index % 2 == 0 ? 'text-right' : 'text-left'
            }`
          "
        >
          {{ comment.comment }}
        </v-card-text>

        <v-card-actions class="px-3 py-0">
          <v-spacer v-if="index % 2 == 0" />
          <span class="text-overline mr-3">{{ comment.user.name }}</span>

          <v-list-item-avatar color="grey darken-3">
            <v-img alt="" :src="comment.user.avatar" />
          </v-list-item-avatar>

          <v-spacer v-if="index % 2 != 0" />
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "Expenses",
  props: ["expense"],
  data() {
    return {
      size: false,
      devExpense: {
        dateCreated: new Date(),
        sum: -24.65,
        type: "spontaneous",
        sellingPoint: {
          name: "Alnatura",
          initials: "AN",
          icon: "🛒",
          category: "food groceries",
        },

        comments: [
          {
            user: {
              name: "Stephan",
              avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
            },
            comment: "Super teuer dieses mal",
          },
          {
            user: {
              name: "Theresa",
              avatar: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
            },
            comment: "Ich glaube die Milch ist teurer geworden",
          },
        ],
        images: [
          { url: "https://media.giphy.com/media/67ThRZlYBvibtdF9JH/giphy.gif" },
          { url: "https://media.giphy.com/media/xTiTnqUxyWbsAXq7Ju/giphy.gif" },
        ],
      },
      expenseToShow: null,
    };
  },
  computed: {},
  created() {
    if (!this.expense) {
      this.expenseToShow = this.devExpense;
    } else {
      this.expenseToShow = this.expense;
    }
  },
  methods: {
    toogleSize() {
      this.size = !this.size;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
:root {
  --main-minified-item-height: 40px;
}

#container {
  background: #fcfcfc;
  border-radius: 14px;
  display: grid;
  width: 100%;
  column-gap: 10px;
  row-gap: 10px;
}

.minified {
  grid-template-rows: 40px;
  grid-template-columns: 40px 24px 4fr 40px;
  grid-template-areas: "sellingPointInitials sellingPointIcon expenseSum moreBtn";
}

.expanded {
  grid-template-rows: 40px auto auto auto;
  grid-template-columns: 40px 24px 4fr 40px;
  grid-template-areas:
    "sellingPointInitials sellingPointIcon sellingPointCategoryAndName moreBtn"
    "expenseSum expenseSum expenseSum expenseSum"
    "receiptsImages receiptsImages receiptsImages receiptsImages"
    "comments comments comments comments";
}

.expenseSum {
  grid-area: expenseSum;
}

.sellingPointInitials {
  align-self: center;
  background: red;
  border-radius: 4px;
  grid-area: sellingPointInitials;
  height: var(--main-minified-item-height);
  line-height: 40px;
  text-align: center;
}

.sellingPointIcon {
  align-self: center;
  grid-area: sellingPointIcon;
  height: var(--main-minified-item-height);
  width: 24px;
}

.sellingPointCategoryAndName {
  align-self: center;
  grid-area: sellingPointCategoryAndName;
}

.receiptsImages {
  grid-area: receiptsImages;
  height: auto;
}

.comments {
  grid-area: comments;
  height: auto;
}

/* Vuetify override */
.v-application .text-button {
  line-height: 20px;
}
.v-application .text-overline {
  line-height: 20px;
}
</style>

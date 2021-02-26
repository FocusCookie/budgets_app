<script>
// https://github.com/vuetifyjs/vuetify/issues/4059 BY THIS THREAD!

import { VTextField } from "vuetify/lib";

export default {
  extends: VTextField,

  props: {
    items: {
      type: Array,
      required: true,
    },
    appendOuterIcon: {
      type: String,
      default: "$dropdown",
    },
  },

  methods: {
    genInput() {
      const listeners = Object.assign({}, this.listeners$);
      delete listeners["change"]; // Change should not be bound externally

      return this.$createElement(
        "select",
        {
          style: {},
          domProps: {
            value: this.lazyValue,
          },
          attrs: {
            ...this.attrs$,
            autofocus: this.autofocus,
            disabled: this.disabled,
            id: this.computedId,
            readonly: this.readonly,
          },
          on: Object.assign(listeners, {
            blur: this.onBlur,
            input: this.onInput,
            focus: this.onFocus,
            keydown: this.onKeyDown,
          }),
          ref: "input",
        },
        this.genOptions(),
      );
    },

    genOptions() {
      return this.items.map(item => {
        return this.$createElement("option", {
          domProps: {
            innerHTML: item,
            value: item,
          },
        });
      });
    },
  },
};
</script>

<style scoped>
select {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  color: rgba(0, 0, 0, 0.87);
  cursor: pointer;
}

select:focus {
  outline: none;
}

.v-input__append-outer {
  position: absolute;
  right: 11px;
}
</style>

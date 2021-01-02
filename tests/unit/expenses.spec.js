import Vue from "vue";
import "../setupTestInstance";

import { shallowMount } from "@vue/test-utils";
import Expenses from "@/components/Expenses.vue";

const testExpense = {
  dateCreated: new Date(),
  sum: 24.65,
  type: "spontaneous",
  sellingPoint: {
    name: "DEV Alnatura",
    initials: "AN",
    icon: "🛒",
    category: "food groceries",
  },
};

describe("Expenses.vue", () => {
  it("should render the expense component", () => {
    const wrapper = shallowMount(Expenses, {
      propsData: { expense: testExpense },
    });

    const expense = wrapper.find("#expensesContainer");

    // component is rendered
    expect(expense.exists()).toBeTruthy();
  });

  it("should render the expense with the given props data from expense", () => {
    const wrapper = shallowMount(Expenses, {
      propsData: { expense: testExpense },
    });

    const expense = wrapper.find("#expensesContainer");

    const sellingPointInitials = wrapper.find(".sellingPointInitials");
    const sellingPointIcon = wrapper.find(".sellingPointIcon");
    const sellingPointCategory = wrapper.find(".sellingPointCategory");
    const sellingPointName = wrapper.find(".sellingPointName");
    const expenseSum = wrapper.find(".expenseSum");

    expect(expense.exists()).toBeTruthy();

    expect(sellingPointInitials.exists()).toBeTruthy();
    expect(sellingPointInitials.text()).toBe(testExpense.sellingPoint.initials);

    expect(sellingPointIcon.exists()).toBeTruthy();
    expect(sellingPointIcon.text()).toBe(testExpense.sellingPoint.icon);

    expect(sellingPointCategory.exists()).toBeTruthy();
    expect(sellingPointCategory.text()).toBe(testExpense.sellingPoint.category);

    expect(sellingPointName.exists()).toBeTruthy();
    expect(sellingPointName.text()).toBe(testExpense.sellingPoint.name);

    // sum is rendered as sum 4.44 €, so cut off the Euro and check the sum
    expect(expenseSum.exists()).toBeTruthy();
    expect(expenseSum.text().split(" ")[0]).toBe(testExpense.sum.toString());
  });

  it("should emit an edit and the expense, when the edit button is clicked", async () => {
    const wrapper = shallowMount(Expenses, {
      propsData: { expense: testExpense },
    });

    const editBtn = wrapper.find("#editBtn");

    expect(editBtn.exists()).toBeTruthy();

    // trigger the emit with the method, trigger the emit via the btn didn't work
    // TODO: find a way to trigger the click cia editBtn-trigger("click")
    wrapper.vm.emitEdit();

    expect(wrapper.emitted().edit[0][0]).toBe(testExpense);
  });
});

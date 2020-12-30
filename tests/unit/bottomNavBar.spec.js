import Vue from "vue";
import "../setupTestInstance";

import { shallowMount } from "@vue/test-utils";
import BottomNavBar from "@/components/BottomNavBar.vue";

const icons = {
  home: "mdi-home-outline",
  analytics: "mdi-chart-arc",
  history: "mdi-calendar",
  settings: "mdi-cog-outline",
};

describe("BottomNavbar.vue", () => {
  it("should render the navbar component with the correct icons", () => {
    const $route = {
      path: "/home",
    };

    const wrapper = shallowMount(BottomNavBar, {
      mocks: {
        $route,
      },
    });

    const nav = wrapper.find("#container");

    const homeIcon = wrapper.find("#homeIcon");
    const analyticsIcon = wrapper.find("#analyticsIcon");
    const historyIcon = wrapper.find("#historyIcon");
    const settingsIcon = wrapper.find("#settingsIcon");

    // component is rendered
    expect(nav.exists()).toBe(true);

    // check icons
    expect(homeIcon.text()).toBe(icons.home);
    expect(analyticsIcon.text()).toBe(icons.analytics);
    expect(historyIcon.text()).toBe(icons.history);
    expect(settingsIcon.text()).toBe(icons.settings);
  });

  it("should dispaly home as active and the slider should be over home if the route is /home, the other links shouldn't be active", () => {
    const $route = {
      path: "/home",
    };

    const wrapper = shallowMount(BottomNavBar, {
      mocks: {
        $route,
      },
    });

    const slider = wrapper.find(".slider");
    const homeIcon = wrapper.find("#homeIcon");
    const analyticsIcon = wrapper.find("#analyticsIcon");
    const historyIcon = wrapper.find("#historyIcon");
    const settingsIcon = wrapper.find("#settingsIcon");

    // Slider should stay over home
    expect(slider.classes()).toContain("sliderMoveToHome");

    // check icon colors
    expect(homeIcon.attributes().color).toBe("primary");
    expect(analyticsIcon.attributes().color).toBe("");
    expect(historyIcon.attributes().color).toBe("");
    expect(settingsIcon.attributes().color).toBe("");
  });

  it("should dispaly analytics as active and the slider should be over home if the route is /anaylics, the other links shouldn't be active", () => {
    const $route = {
      path: "/analytics",
    };

    const wrapper = shallowMount(BottomNavBar, {
      mocks: {
        $route,
      },
    });

    const slider = wrapper.find(".slider");
    const homeIcon = wrapper.find("#homeIcon");
    const analyticsIcon = wrapper.find("#analyticsIcon");
    const historyIcon = wrapper.find("#historyIcon");
    const settingsIcon = wrapper.find("#settingsIcon");

    // Slider should stay over home
    expect(slider.classes()).toContain("sliderMoveToAnalytics");

    // check icon colors
    expect(homeIcon.attributes().color).toBe("");
    expect(analyticsIcon.attributes().color).toBe("primary");
    expect(historyIcon.attributes().color).toBe("");
    expect(settingsIcon.attributes().color).toBe("");
  });

  it("should dispaly history as active and the slider should be over home if the route is /anaylics, the other links shouldn't be active", () => {
    const $route = {
      path: "/history",
    };

    const wrapper = shallowMount(BottomNavBar, {
      mocks: {
        $route,
      },
    });

    const slider = wrapper.find(".slider");
    const homeIcon = wrapper.find("#homeIcon");
    const analyticsIcon = wrapper.find("#analyticsIcon");
    const historyIcon = wrapper.find("#historyIcon");
    const settingsIcon = wrapper.find("#settingsIcon");

    // Slider should stay over home
    expect(slider.classes()).toContain("sliderMoveToHistory");

    // check icon colors
    expect(homeIcon.attributes().color).toBe("");
    expect(analyticsIcon.attributes().color).toBe("");
    expect(historyIcon.attributes().color).toBe("primary");
    expect(settingsIcon.attributes().color).toBe("");
  });

  it("should dispaly settings as active and the slider should be over home if the route is /anaylics, the other links shouldn't be active", () => {
    const $route = {
      path: "/settings",
    };

    const wrapper = shallowMount(BottomNavBar, {
      mocks: {
        $route,
      },
    });

    const slider = wrapper.find(".slider");
    const homeIcon = wrapper.find("#homeIcon");
    const analyticsIcon = wrapper.find("#analyticsIcon");
    const historyIcon = wrapper.find("#historyIcon");
    const settingsIcon = wrapper.find("#settingsIcon");

    // Slider should stay over home
    expect(slider.classes()).toContain("sliderMoveToSettings");

    // check icon colors
    expect(homeIcon.attributes().color).toBe("");
    expect(analyticsIcon.attributes().color).toBe("");
    expect(historyIcon.attributes().color).toBe("");
    expect(settingsIcon.attributes().color).toBe("primary");
  });

  it("should move the slider accordingly to the route after a click on an item in the navbar - home to settings", async () => {
    let $route = {
      path: "/home",
    };
    const $router = [];

    const wrapper = shallowMount(BottomNavBar, {
      mocks: {
        $route,
        $router,
      },
    });

    const slider = wrapper.find(".slider");

    // Slider should stay over home
    expect(slider.classes()).toContain("sliderMoveToHome");

    // click on settings simulated with change of route because with a fake $router it cant be tested
    $route.path = "/settings";

    // wait for rendring
    await Vue.nextTick();

    // slider should stay over settings now
    expect(slider.classes()).toContain("sliderMoveToSettings");
  });

  it("should change the router accordingly to the item which is clicked on - home to settings", async () => {
    let $route = {
      path: "/home",
    };
    const $router = [];

    const wrapper = shallowMount(BottomNavBar, {
      mocks: {
        $route,
        $router,
      },
    });

    expect($router.length).toBe(0);

    const settings = wrapper.find(".settings");

    await settings.trigger("click");

    // wait for rendring
    await Vue.nextTick();

    expect($router.length).toBe(1);
    expect($router[0]).toBe("settings");
  });
});

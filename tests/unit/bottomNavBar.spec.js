import Vue from "vue";
import "../setupTestInstance";

import { shallowMount } from "@vue/test-utils";
import BottomNavBar from "@/components/BottomNavBar.vue";

const icons = {
  home: "mdi-home-outline",
  analytics: "mdi-chart-arc",
  history: "mdi-calendar-range",
  settings: "mdi-cog-outline",
};

describe("BottomNavbar.vue", () => {
  it("should render the navbar component with the right icons and the home item should be active", () => {
    const $route = {
      path: "/home",
    };

    const wrapper = shallowMount(BottomNavBar, {
      mocks: {
        $route,
      },
    });

    const nav = wrapper.find("#navbarWrapper");

    const navItems = wrapper.findAll(".linkWrapper");

    // component is rendered
    expect(nav.exists()).toBe(true);

    // linkWrapper existing
    expect(navItems.at(0).exists()).toBe(true);
    expect(navItems.at(1).exists()).toBe(true);
    expect(navItems.at(2).exists()).toBe(true);
    expect(navItems.at(3).exists()).toBe(true);

    // only the home element border should be active
    expect(navItems.at(0).html()).toMatch(/borderActive/gi);
    expect(navItems.at(1).html()).toMatch(/borderInactive/gi);
    expect(navItems.at(2).html()).toMatch(/borderInactive/gi);
    expect(navItems.at(3).html()).toMatch(/borderInactive/gi);

    // right icons
    expect(navItems.at(0).text()).toMatch(icons.home);
    expect(navItems.at(1).text()).toMatch(icons.analytics);
    expect(navItems.at(2).text()).toMatch(icons.history);
    expect(navItems.at(3).text()).toMatch(icons.settings);
  });

  it("should display the analytics item as active if the route is /analytics", () => {
    const $route = {
      path: "/analytics",
    };

    const wrapper = shallowMount(BottomNavBar, {
      mocks: {
        $route,
      },
    });

    const nav = wrapper.find("#navbarWrapper");

    const navItems = wrapper.findAll(".linkWrapper");

    // only the home element border should be active
    expect(navItems.at(0).html()).toMatch(/borderInactive/gi);
    expect(navItems.at(1).html()).toMatch(/borderActive/gi);
    expect(navItems.at(2).html()).toMatch(/borderInactive/gi);
    expect(navItems.at(3).html()).toMatch(/borderInactive/gi);
  });

  it("should display the history item as active if the route is /history", () => {
    const $route = {
      path: "/history",
    };

    const wrapper = shallowMount(BottomNavBar, {
      mocks: {
        $route,
      },
    });

    const nav = wrapper.find("#navbarWrapper");

    const navItems = wrapper.findAll(".linkWrapper");

    // only the home element border should be active
    expect(navItems.at(0).html()).toMatch(/borderInactive/gi);
    expect(navItems.at(1).html()).toMatch(/borderInactive/gi);
    expect(navItems.at(2).html()).toMatch(/borderActive/gi);
    expect(navItems.at(3).html()).toMatch(/borderInactive/gi);
  });

  it("should display the settings item as active if the route is /settings", () => {
    const $route = {
      path: "/settings",
    };

    const wrapper = shallowMount(BottomNavBar, {
      mocks: {
        $route,
      },
    });

    const nav = wrapper.find("#navbarWrapper");

    const navItems = wrapper.findAll(".linkWrapper");

    // only the home element border should be active
    expect(navItems.at(0).html()).toMatch(/borderInactive/gi);
    expect(navItems.at(1).html()).toMatch(/borderInactive/gi);
    expect(navItems.at(2).html()).toMatch(/borderInactive/gi);
    expect(navItems.at(3).html()).toMatch(/borderActive/gi);
  });

  it("should set the home item as active if the home btn is clicked and the route was not home already", async () => {
    const $route = {
      path: "/settings",
    };

    let $router = [];

    const wrapper = shallowMount(BottomNavBar, {
      mocks: {
        $route,
        $router,
      },
    });

    const home = wrapper.find("#home");

    expect(home.exists()).toBeTruthy();

    // class should be borderInactive
    expect(home.html()).toMatch(/borderInactive/gi);

    // click on home
    home.trigger("click");
    // wait for new render
    await Vue.nextTick();

    // border should be active
    expect(home.html()).toMatch(/borderActive/gi);
  });
});

const mobileBreakpoint = 800;
let globalWindowWidth = window.innerWidth;

import { initiate } from "../hero-animation/hero-animation.js";

export default function decorate($block) {
  initiate($block);
}
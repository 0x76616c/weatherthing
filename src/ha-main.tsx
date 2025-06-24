import React from "react";
import { createRoot } from "react-dom/client";
import HaThing from "./HaThing";

import type { Root } from "react-dom/client";

type HassType = Record<string, unknown>; // TODO
type ConfigType = Record<string, unknown>; // TODO

class MyReactLovelaceCard extends HTMLElement {
  private _hass: HassType | undefined;
  private _config: ConfigType | undefined;
  private _root: ShadowRoot;
  private _reactRoot: Root | null = null;

  constructor() {
    super();
    this._root = this.attachShadow({ mode: "open" });
  }

  set hass(hassObj: HassType) {
    this._hass = hassObj;
    this._render();
  }

  set config(configObj: ConfigType) {
    this._config = configObj;
    this._render();
  }

  setConfig(configObj: ConfigType) {
    if (!configObj) {
      throw new Error("Invalid configuration");
    }
    this._config = configObj;
    this._render();
  }

  connectedCallback() {
    this._render();
  }

  disconnectedCallback() {
    if (this._reactRoot) {
      this._reactRoot.unmount();
      this._reactRoot = null;
    }
  }

  _render() {
    if (!this._hass || !this._config) {
      return;
    }
    if (!this._reactRoot) {
      this._reactRoot = createRoot(this._root);
    }
    this._reactRoot.render(
      React.createElement(
        "ha-card",
        null,
        React.createElement(HaThing, { hass: this._hass, config: this._config })
      )
    );
  }
}

customElements.define("weather-card", MyReactLovelaceCard);

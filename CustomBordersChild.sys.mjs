/**
 * Custom Borders - Child Window Actor (runs in web content processes)
 * Author: nounemsky | Version: 1.0.0
 */

let currentConfig = null;

export class CustomBordersChild extends JSWindowActorChild {
  constructor() {
    super();
    this._onBroadcast = this._onBroadcast.bind(this);
    try {
      Services.cpmm.addMessageListener("CustomBorders:BroadcastConfig", this._onBroadcast);
    } catch (e) {}
  }

  didDestroy() {
    try {
      Services.cpmm.removeMessageListener("CustomBorders:BroadcastConfig", this._onBroadcast);
    } catch (e) {}
  }

  _onBroadcast(msg) {
    if (msg?.data) {
      currentConfig = msg.data;
      this.updateStyles();
    }
  }

  actorCreated() {
    const doc = this.contentWindow?.document;
    if (doc && (doc.readyState === "interactive" || doc.readyState === "complete")) {
      this._init();
    }
  }

  handleEvent(event) {
    if (event.type === "DOMContentLoaded" || event.type === "pageshow") {
      this._init();
    }
  }

  async _init() {
    if (!currentConfig) {
      try {
        currentConfig = await this.sendQuery("CustomBorders:GetConfig");
      } catch (e) {}
    }
    this.updateStyles();
  }

  updateStyles() {
    try {
      const win = this.contentWindow;
      if (!win || !win.document) return;
      const href = win.location?.href || "";
      if (!href.startsWith("http://") && !href.startsWith("https://")) {
        return;
      }

      const doc = win.document;
      const existingStyle = doc.getElementById("zen-custom-borders-web-style");

      if (!currentConfig || !currentConfig.enabled || !currentConfig.webContent) {
        if (existingStyle) existingStyle.remove();
        return;
      }

      const btn = currentConfig.buttons || "8px";
      const inp = currentConfig.inputs || "8px";

      const css = `
        button,
        input[type="button"],
        input[type="submit"],
        input[type="reset"],
        [role="button"],
        a[role="button"] {
          border-radius: ${btn} !important;
        }

        input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="image"]):not([type="color"]):not([type="range"]),
        input[type="text"],
        input[type="search"],
        input[type="password"],
        input[type="email"],
        input[type="number"],
        input[type="url"],
        input[type="tel"],
        textarea,
        select {
          border-radius: ${inp} !important;
        }
      `;

      if (existingStyle) {
        if (existingStyle.textContent !== css) {
          existingStyle.textContent = css;
        }
      } else {
        const style = doc.createElement("style");
        style.id = "zen-custom-borders-web-style";
        style.textContent = css;
        (doc.head || doc.documentElement).appendChild(style);
      }
    } catch (e) {}
  }
}

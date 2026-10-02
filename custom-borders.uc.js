// ==UserScript==
// @name            Custom Borders
// @description     Synchronizes custom border-radius properties globally across browser windows, dialogs, urlbar, folders, workspaces and about:* settings pages.
// @author          nounemsky
// @version         1.0.0
// ==/UserScript==

(function() {
  const PREFS = [
    { name: "zen-custom-borders.enabled", prop: "--zen-custom-borders-enabled", def: true, type: "bool" },
    { name: "zen-custom-borders.buttons", prop: "--zen-custom-borders-buttons", def: "8px", type: "string" },
    { name: "zen-custom-borders.inputs", prop: "--zen-custom-borders-inputs", def: "8px", type: "string" },
    { name: "zen-custom-borders.urlbar", prop: "--zen-custom-borders-urlbar", def: "10px", type: "string" },
    { name: "zen-custom-borders.tabs", prop: "--zen-custom-borders-tabs", def: "8px", type: "string" },
    { name: "zen-custom-borders.workspaces", prop: "--zen-custom-borders-workspaces", def: "8px", type: "string" },
    { name: "zen-custom-borders.popups", prop: "--zen-custom-borders-popups", def: "10px", type: "string" },
    { name: "zen-custom-borders.notifications", prop: "--zen-custom-borders-notifications", def: "12px", type: "string" }
  ];

  function getPrefVal(pref) {
    try {
      if (pref.type === "bool") {
        return Services.prefs.getBoolPref(pref.name, pref.def);
      }
      return Services.prefs.getStringPref(pref.name, pref.def);
    } catch (e) {
      return pref.def;
    }
  }

  function applyToDocument(doc) {
    if (!doc || !doc.documentElement) return;
    try {
      const enabled = getPrefVal(PREFS[0]);
      if (!enabled) {
        doc.documentElement.removeAttribute("zen-custom-borders-active");
        for (const pref of PREFS.slice(1)) {
          doc.documentElement.style.removeProperty(pref.prop);
        }
        const existingStyle = doc.getElementById("zen-custom-borders-runtime-override");
        if (existingStyle) existingStyle.remove();
        return;
      }

      doc.documentElement.setAttribute("zen-custom-borders-active", "true");
      const values = {};
      for (const pref of PREFS.slice(1)) {
        const val = getPrefVal(pref);
        values[pref.name] = val;
        doc.documentElement.style.setProperty(pref.prop, val);
      }

      const isChrome = doc.location && doc.location.href.startsWith("chrome://browser/content/browser.xhtml");
      if (isChrome) {
        let styleEl = doc.getElementById("zen-custom-borders-runtime-override");
        if (!styleEl) {
          styleEl = doc.createElement("style");
          styleEl.id = "zen-custom-borders-runtime-override";
          (doc.head || doc.documentElement).appendChild(styleEl);
        }

        const urlbarVal = values["zen-custom-borders.urlbar"] || "10px";
        const foldersVal = values["zen-custom-borders.tabs"] || "8px";
        const wsVal = values["zen-custom-borders.workspaces"] || "8px";

        styleEl.textContent = `
          #urlbar,
          .urlbar,
          .urlbar-background,
          #urlbar-background,
          div.urlbar-background,
          #urlbar:not([breakout-extend]) > .urlbar-background,
          #urlbar:not([breakout-extend]) > #urlbar-background,
          #urlbar[breakout-extend] > .urlbar-background,
          #urlbar[breakout-extend] > #urlbar-background,
          #urlbar[breakout-extend="true"] > #urlbar-background,
          #urlbar[breakout-extend="true"] > .urlbar-background,
          #urlbar[open] > .urlbar-background,
          #urlbar[open] > #urlbar-background,
          #urlbar-input-container,
          #searchbar {
            border-radius: ${urlbarVal} !important;
          }

          zen-folder,
          tab-group,
          .tab-group-label-container,
          .tab-group-label-container::before,
          zen-folder > .tab-group-label-container::before,
          tab-group > .tab-group-label-container::before,
          .folders-tabs-list-item,
          .folders-tabs-list-item-content {
            border-radius: ${foldersVal} !important;
          }

          #zen-workspaces-button,
          #zen-workspaces-button toolbarbutton,
          #zen-workspaces-button toolbarbutton::before,
          #zen-workspaces-button toolbarbutton::after,
          .zen-current-workspace-indicator,
          .zen-current-workspace-indicator::before,
          .zen-current-workspace-indicator::after,
          .zen-workspace-button,
          .zen-workspace-tab-item,
          .zen-workspace-tab-item::before,
          .zen-workspace-tab-item::after {
            border-radius: ${wsVal} !important;
          }
        `;
      }
    } catch (err) {
      // Ignore cross-origin frame errors
    }
  }

  function updateAllWindows() {
    try {
      const windows = Services.wm.getEnumerator(null);
      while (windows.hasMoreElements()) {
        const win = windows.getNext();
        applyToDocument(win.document);

        if (win.gBrowser && win.gBrowser.browsers) {
          for (const browser of win.gBrowser.browsers) {
            try {
              if (browser.contentDocument) {
                applyToDocument(browser.contentDocument);
              }
            } catch (e) {}
          }
        }
      }
    } catch (e) {
      console.error("[Custom-borders]: Error updating windows:", e);
    }
  }

  const prefObserver = {
    observe: (subject, topic, data) => {
      if (data && data.startsWith("zen-custom-borders.")) {
        updateAllWindows();
      }
    }
  };

  Services.prefs.addObserver("zen-custom-borders.", prefObserver);

  window.addEventListener("DOMContentLoaded", (e) => {
    applyToDocument(e.target);
  }, true);

  if (window.gBrowser) {
    window.gBrowser.addTabsProgressListener({
      onLocationChange: (browser) => {
        try {
          if (browser && browser.contentDocument) {
            applyToDocument(browser.contentDocument);
          }
        } catch (e) {}
      }
    });
  }

  updateAllWindows();
})();

/**
 * Custom Borders - Parent Window Actor
 * Author: nounemsky | Version: 1.0.0
 */

export class CustomBordersParent extends JSWindowActorParent {
  receiveMessage(message) {
    if (message.name === "CustomBorders:GetConfig") {
      try {
        const enabled = Services.prefs.getBoolPref("zen-custom-borders.enabled", true);
        const webContent = Services.prefs.getBoolPref("zen-custom-borders.web-content", false);
        const buttons = Services.prefs.getStringPref("zen-custom-borders.buttons", "8px");
        const inputs = Services.prefs.getStringPref("zen-custom-borders.inputs", "8px");
        return { enabled, webContent, buttons, inputs };
      } catch (e) {
        return { enabled: true, webContent: false, buttons: "8px", inputs: "8px" };
      }
    }
    return null;
  }
}

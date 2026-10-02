# Custom Borders

A lightweight mod for Zen Browser that lets you customize the border radius of buttons, input fields, the URL bar, tabs, folders, workspaces, and menus.

## Features

- **Buttons**: Customize the corner radius of all toolbar buttons, navigation icons, action buttons, and dialog controls.
- **Inputs**: Adjust corner radius for search boxes, text inputs, find bars, and internal preference fields.
- **URL Bar**: Set a custom border radius for the address bar (omnibox) and autocomplete popup.
- **Tabs & Folders**: Customize vertical tab radius and folder header containers.
- **Workspaces**: Style workspace buttons and the active workspace indicator.
- **Menus & Popups**: Configure border radius for context menus, panels, and popup notifications.
- **Websites (Optional)**: Toggle custom border radius on buttons and inputs across external web pages.

## Values & Units

You can use standard CSS values in the mod preferences:
- `0px`: Sharp, rectangular corners.
- `4px`: Subtle rounding.
- `8px`: Standard moderate rounding (default).
- `14px` / `18px`: Pronounced modern rounding.
- `9999px`: Fully rounded pill buttons.

## Installation

### Via Zen Mods / Theme Store
Install **Custom Borders** directly from the Zen Theme Store or Sine marketplace.

### Manual
1. Clone or download this repository into your Zen profile's `chrome` directory.
2. Enable userChrome styles in `about:config` (`toolkit.legacyUserProfileCustomizations.stylesheets` set to `true`).
3. Import `chrome.css` in your `userChrome.css` and `userContent.css` in your `userContent.css`.

## License

MIT License

package config

// set your app specific settings there

var (
	// these are the overrides for your wails config
	customConfig = map[string]interface{}{
		// this is the sub config dir %APPDATA%\%s ~/.config/%s
		"AppId": "template",
		// put your overrides, extra config there
		"Title": "Wails + Svelte + Tailwind + AOS Demo",
		// "Tooltip": "Show app", // systray hover tooltip
		// "DisableResize":     true,
		// "EnableSystray":     true,
		// "HideWindowOnClose": true, // not used if "EnableSystray" is not active, a custom handler manage that state as wails do not tell us when the window is hidden
		// "StartHidden":       true, // not used if "EnableSystray" is not active
		// "Frameless": true,
		// "MaximizeFullscreen": true, // set fullscreen mode on maximize (only works for frameless, if set to true on mac frameless will be disabled)
		// "MinWidth":  1280,
		// "MinHeight": 720,
		// "MaxWidth":  1280, // if set app will not be maximizable
		// "MaxHeight": 720,  // if set app will not be maximizable
	}
	// these are the settings for your svelte application
	customAppConfig = map[string]interface{}{
		// used on skeleton header if defined (else it will use wails Title):
		"AppTitle": "My Wails Template",
	}
)

package config

import (
	"goapp/backend/util"
)

var (
	customConfig = map[string]interface{}{
		// put your overrides, extra config there
		"Title": "Wails + Svelte + Tailwind + AOS Demo",
		// used on skeleton header if defined:
		"AppTitle": "My Wails Template",
		// "Tooltip": "Show app",
		// "HideWindowOnClose": true,
		// "EnableSystray":     true,
		// "StartHidden":   true,
		// "Frameless": true,
		// "MinWidth":  1280,
		// "MinHeight": 720,
		// "MaxWidth":  1280,
		// "MaxHeight": 720,
	}
	defaultConfig = map[string]interface{}{
		"Title":             "Wails + Svelte + Tailwind + AOS Demo",
		"Width":             0,
		"Height":            0,
		"MinWidth":          1024,
		"MinHeight":         768,
		"MaxWidth":          0,
		"MaxHeight":         0,
		"DisableResize":     false,
		"Frameless":         false,
		"StartHidden":       false,
		"HideWindowOnClose": false,
		"AlwaysOnTop":       false,
		// Normal     WindowStartState = 0
		// Maximised  WindowStartState = 1
		// Minimised  WindowStartState = 2
		// Fullscreen WindowStartState = 3
		"WindowStartState":     0,
		"WebviewIsTransparent": false,
		"WindowIsTranslucent":  false,
		"DisableWindowIcon":    false,
	}

	config = util.NewConfig(
		defaultConfig,
		customConfig,
	)
)

func Config() *util.Configuration {
	return config
}

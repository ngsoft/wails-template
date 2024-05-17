package config

import (
	"goapp/backend/util"
)

var (
	customConfig = map[string]interface{}{
		// put your overrides, extra config there
		"Title": "Wails + Svelte + Tailwind + AOS Demo",
		// "Tooltip": "Show app",
		// "HideWindowOnClose": true,
		// "EnableSystray":     true,
		// "StartHidden":   true,
		"Frameless": true,
	}
	defaultConfig = map[string]interface{}{
		"Title":             "goapp",
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

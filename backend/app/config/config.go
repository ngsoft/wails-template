package config

import (
	"goapp/backend/util"
)

var (
	defaultConfig = map[string]interface{}{
		"Title":             "goapp",
		"Width":             1024,
		"Height":            768,
		"MinWidth":          0,
		"MinHeight":         0,
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

	config = util.NewConfig(defaultConfig)
)

func Config() *util.Configuration {
	return config
}

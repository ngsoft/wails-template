package config

import (
	"goapp/backend/util"
)

// this is the default config for your app
// please do not modify this file
// you can override all settings in overrides.go

var (
	defaultConfig = map[string]interface{}{
		"AppId":             "goapp",
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
	appConfig = util.NewConfig(customAppConfig)
	// js config load  on demand
	loaded bool
	// app overrides to make previous defined configuration
	// configurable using gui (eg: Frameless, StartHidden, ...)
	overridesLoaded bool
)

// OverrideConfigFileName app overrides filename
func OverrideConfigFileName() string {
	return util.GetConfigPath(config.GetString("AppId"), "app.json")
}

// Config Wails app configuration
func Config() *util.Configuration {
	if !overridesLoaded {
		overridesLoaded = true
		config.LoadFromFile(
			OverrideConfigFileName(),
		)
	}
	return config
}

// AppConfigFileName Svelte app configuration filename
func AppConfigFileName() string {
	return util.GetConfigPath(config.GetString("AppId"), "config.json")
}

// AppConfig Svelte app configuration
func AppConfig() *util.Configuration {
	if !loaded {
		loaded = true
		appConfig.LoadFromFile(AppConfigFileName())
	}
	return appConfig
}

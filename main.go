package main

import (
	"embed"
	"goapp/backend/app/config"
	"goapp/backend/service"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/linux"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := &wailsapp{}
	// load configuration
	cfg := config.Config()
	// Create application with options
	err := wails.Run(&options.App{
		Title:             cfg.GetString("Title"),
		Width:             cfg.GetInt("Width"),
		Height:            cfg.GetInt("Height"),
		MinWidth:          cfg.GetInt("MinWidth"),
		MinHeight:         cfg.GetInt("MinHeight"),
		MaxWidth:          cfg.GetInt("MaxWidth"),
		MaxHeight:         cfg.GetInt("MaxHeight"),
		DisableResize:     cfg.GetBool("DisableResize"),
		Frameless:         cfg.GetBool("Frameless"),
		StartHidden:       cfg.GetBool("StartHidden"),
		HideWindowOnClose: cfg.GetBool("HideWindowOnClose"),
		AlwaysOnTop:       cfg.GetBool("AlwaysOnTop"),
		WindowStartState:  options.WindowStartState(cfg.GetInt("WindowStartState")),
		Windows: &windows.Options{
			WebviewIsTransparent: cfg.GetBool("WebviewIsTransparent"),
			WindowIsTranslucent:  cfg.GetBool("WindowIsTranslucent"),
			DisableWindowIcon:    cfg.GetBool("DisableWindowIcon"),
		},
		Mac: &mac.Options{
			WebviewIsTransparent: cfg.GetBool("WebviewIsTransparent"),
			WindowIsTranslucent:  cfg.GetBool("WindowIsTranslucent"),
		},
		Linux: &linux.Options{
			WindowIsTranslucent: cfg.GetBool("WindowIsTranslucent"),
		},
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		// BackgroundColour: &options.RGBA{R: 255, G: 255, B: 255, A: 255},
		OnStartup:     app.onStartup,
		OnDomReady:    app.onDomReady,
		OnShutdown:    app.onShutdown,
		OnBeforeClose: app.beforeClose,

		Bind: []interface{}{
			service.Service(),
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}

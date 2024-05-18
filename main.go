package main

import (
	"embed"
	"goapp/backend/app/config"
	"goapp/backend/service"
	"goapp/backend/tray"

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

	// specific configuration overrides
	func() {
		// override config to let svelte have a read
		if cfg.GetInt("MaxWidth") > 0 && cfg.GetInt("MaxHeight") > 0 &&
			cfg.GetInt("MaxWidth") == cfg.GetInt("MinWidth") && cfg.GetInt("MaxHeight") == cfg.GetInt("MinHeight") {
			cfg.Set("DisableResize", true)
		}
		if !cfg.GetBool("EnableSystray") {
			// force the settings
			cfg.Set("StartHidden", false)       // how can we show the window ?
			cfg.Set("HideWindowOnClose", false) //window disappears, never to be seen again (how do we close the app then?)
		}

	}()

	// load tray (can only be setup in the main thread)
	tray.Start()

	// Create application with options
	err := wails.Run(&options.App{
		Title:            cfg.GetString("Title"),
		Width:            cfg.GetInt("Width"),
		Height:           cfg.GetInt("Height"),
		MinWidth:         cfg.GetInt("MinWidth"),
		MinHeight:        cfg.GetInt("MinHeight"),
		MaxWidth:         cfg.GetInt("MaxWidth"),
		MaxHeight:        cfg.GetInt("MaxHeight"),
		DisableResize:    cfg.GetBool("DisableResize"),
		Frameless:        cfg.GetBool("Frameless"),
		StartHidden:      cfg.GetBool("StartHidden"),
		AlwaysOnTop:      cfg.GetBool("AlwaysOnTop"),
		WindowStartState: options.WindowStartState(cfg.GetInt("WindowStartState")),
		Windows: &windows.Options{
			WebviewIsTransparent: cfg.GetBool("WebviewIsTransparent"),
			WindowIsTranslucent:  cfg.GetBool("WindowIsTranslucent"),
			DisableWindowIcon:    cfg.GetBool("DisableWindowIcon"),
			OnSuspend:            app.onSuspend,
			OnResume:             app.onResume,
		},
		Mac: &mac.Options{
			WebviewIsTransparent: cfg.GetBool("WebviewIsTransparent"),
			WindowIsTranslucent:  cfg.GetBool("WindowIsTranslucent"),
		},
		Linux: &linux.Options{
			WindowIsTranslucent: cfg.GetBool("WindowIsTranslucent"),
			Icon:                tray.GetIcon("icon.png"),
		},
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		// set up handlers
		OnStartup:     app.onStartup,
		OnDomReady:    app.onDomReady,
		OnShutdown:    app.onShutdown,
		OnBeforeClose: app.beforeClose,

		// add your own exposed services
		Bind: []interface{}{
			service.Service(),
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}

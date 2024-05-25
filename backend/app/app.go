package app

import (
	"context"
	"goapp/backend/app/config"
	"goapp/backend/util"

	r "github.com/wailsapp/wails/v2/pkg/runtime"
)

const (
	Startup  util.EventType = "wails.start"
	Ready    util.EventType = "wails.ready"
	Shutdown util.EventType = "wails.shutdown"
	Close    util.EventType = "wails.beforeclose"
	Suspend  util.EventType = "wails.suspend"
	Resume   util.EventType = "wails.resume"
	Hide     util.EventType = "wails.hide"
	Show     util.EventType = "wails.show"
)

type Application struct {
	util.Logger
	ctx    context.Context
	hidden bool
}

var app = &Application{
	Logger: util.NewLogger("[app]"),
}

func App(ctxs ...context.Context) *Application {
	if len(ctxs) > 0 {
		app.ctx = ctxs[0]
	}
	return app
}

func Hidden() bool {

	// handle systray show app initialization (before Startup event)
	if !util.IsRunning() {
		return config.Config().GetBool("StartHidden")
	}
	return app.hidden
}

func HideWindow() {
	if !Hidden() {
		r.WindowHide(app.ctx)
		app.hidden = true
		util.DispatchEvent(Hide)
	}

}

func ShowWindow() {
	if Hidden() {
		r.WindowShow(app.ctx)
		app.hidden = false
		util.DispatchEvent(Show)
	}
}
func Quit() {
	if !util.IsStopping() {
		util.Stop(0)
		r.Quit(app.ctx)
	}
}

func ToggleMaximise() {
	if config.Config().GetBool("MaximizeFullscreen") {
		if r.WindowIsFullscreen(app.ctx) {
			r.WindowUnfullscreen(app.ctx)
			return
		}
		r.WindowFullscreen(app.ctx)
		return
	}
	r.WindowToggleMaximise(app.ctx)
}

func (a *Application) OnEvent(e *util.Event) {
	switch e.Type {
	case Startup:
		if config.Config().GetBool("StartHidden") && config.Config().GetBool("EnableSystray") {
			app.hidden = true
		}
		util.Start()
	case Ready:
	case Close:

		if config.Config().GetBool("HideWindowOnClose") && config.Config().GetBool("EnableSystray") {
			HideWindow()
			return
		}

		util.Stop(0)
	case Shutdown:
	}

}

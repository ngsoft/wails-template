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
	cfg    *util.Configuration
	hidden bool
}

var app = &Application{
	Logger: util.NewLogger("[app]"),
	cfg:    config.Config(),
}

func App(ctxs ...context.Context) *Application {
	if len(ctxs) > 0 {
		app.ctx = ctxs[0]
	}
	return app
}

func (a *Application) Config() *util.Configuration {
	return a.cfg
}

func (a *Application) Hidden() bool {

	// handle systray show app initialization (before Startup event)
	if !util.IsRunning() {
		return app.cfg.GetBool("StartHidden")
	}

	return a.hidden
}

func (a *Application) Hide() {
	if !a.Hidden() {
		r.WindowHide(a.ctx)
		a.hidden = true
		util.DispatchEvent(Hide)
	}

}

func (a *Application) Show() {
	if a.Hidden() {
		r.WindowShow(a.ctx)
		a.hidden = false
		util.DispatchEvent(Show)
	}
}
func (a *Application) Quit() {
	if !util.IsStopping() {
		util.Stop(0)
		r.Quit(a.ctx)
	}
}
func (a *Application) OnEvent(e *util.Event) {
	switch e.Type {
	case Startup:
		if a.Config().GetBool("StartHidden") {
			a.hidden = true
		}
		util.Start()
	case Ready:
	case Close:

		if a.Config().GetBool("HideWindowOnClose") && a.Config().GetBool("EnableSystray") {
			a.Hide()
			return
		}

		util.Stop(0)
	case Shutdown:
	}

}

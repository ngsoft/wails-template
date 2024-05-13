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

func App() *Application {
	return app
}

func (a *Application) Config() *util.Configuration {
	return a.cfg
}

func (a *Application) Hidden() bool {
	return a.hidden
}

func (a *Application) Hide() {
	if !a.Hidden() {
		r.WindowHide(a.ctx)
		a.hidden = true
	}

}

func (a *Application) Show() {
	if a.Hidden() {
		r.WindowShow(a.ctx)
		a.hidden = false
	}
}

func (a *Application) OnEvent(e *util.Event) {
	var (
		ctx context.Context
	)
	if len(e.Params) > 0 {
		if v, ok := e.Params[0].(context.Context); ok {
			ctx = v

		}
	}
	// a.Info("event: %v", e.Type)
	switch e.Type {
	case Startup:
		a.ctx = ctx
		util.Start()
	case Ready:
	case Close:

		if a.Config().GetBool("HideWindowOnClose") && a.Config().GetBool("EnableSystray") {
			a.Info("hiding app")
			a.Hide()
			return
		}

		util.Stop(0)
	case Shutdown:
	}

}

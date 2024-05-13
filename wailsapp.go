package main

import (
	"context"
	"goapp/backend/app"
	"goapp/backend/service"
	"goapp/backend/util"
)

const (
	Startup  util.EventType = "wails.start"
	Ready    util.EventType = "wails.ready"
	Shutdown util.EventType = "wails.shutdown"
	Close    util.EventType = "wails.beforeclose"
)

type wailsapp struct {
	ctx context.Context
}

func (a *wailsapp) onStartup(ctx context.Context) {
	a.ctx = ctx
	util.AddEventHandler(app.App())
	service.Service(ctx)
	// tray.Tray(ctx)
	util.Start()
	util.DispatchEvent(Startup, ctx)
}

func (a *wailsapp) onDomReady(ctx context.Context) {
	util.DispatchEvent(Ready, ctx)
}

func (a *wailsapp) onShutdown(ctx context.Context) {
	util.DispatchEvent(Shutdown, ctx)
}

func (a *wailsapp) beforeClose(ctx context.Context) bool {
	util.DispatchEvent(Close, ctx)
	return util.IsStopping()
}

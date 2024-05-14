package main

import (
	"context"
	"goapp/backend/app"
	"goapp/backend/service"
	"goapp/backend/tray"
	"goapp/backend/util"
)

type wailsapp struct {
	ctx context.Context
}

func (a *wailsapp) onStartup(ctx context.Context) {
	a.ctx = ctx
	util.AddEventHandler(app.App(ctx))
	service.Service(ctx)
	tray.Tray(ctx)
	util.Start()
	util.DispatchEvent(app.Startup, ctx)
}

func (a *wailsapp) onDomReady(ctx context.Context) {
	util.DispatchEvent(app.Ready)
}

func (a *wailsapp) onShutdown(ctx context.Context) {
	util.DispatchEvent(app.Shutdown)
}

func (a *wailsapp) beforeClose(ctx context.Context) bool {
	util.DispatchEvent(app.Close)
	return !util.IsStopping()
}

func (a *wailsapp) onSuspend() {
	util.DispatchEvent(app.Suspend)
}

func (a *wailsapp) onResume() {
	util.DispatchEvent(app.Resume)
}

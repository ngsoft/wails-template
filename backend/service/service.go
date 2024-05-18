package service

import (
	"context"
	"goapp/backend/app"
	"goapp/backend/app/config"
	"goapp/backend/util"
	"sync"
)

type service struct {
	ctx context.Context
}

var (
	instance   = &service{}
	appCfgLock sync.Mutex
	ovrCfgLock sync.Mutex
)

//goland:noinspection GoExportedFuncWithUnexportedType
func Service(ctxs ...context.Context) *service {
	if len(ctxs) > 0 {
		instance.ctx = ctxs[0]
	}
	return instance
}

// default exposed services

// CloseWindow reads cfg and hides or closes windows
func (*service) CloseWindow() {
	if util.IsStopping() {
		return
	}
	if config.Config().GetBool("HideWindowOnClose") && config.Config().GetBool("EnableSystray") {
		app.HideWindow()
	} else {
		app.Quit()
	}

}

// AppGetConfig share configuration between go and js app
func (*service) AppGetConfig(name string) interface{} {
	// load from js config
	if val := config.AppConfig().GetValue(name); val != nil {
		return val
	}
	// fallback to wails config
	return config.Config().GetValue(name)
}

// AppSetConfig set js config and saves it to file
func (*service) AppSetConfig(name string, value interface{}) bool {

	var (
		cfg      = config.AppConfig()
		filename = config.AppConfigFileName()
	)
	// set to js config
	cfg.SetValue(name, value)
	// save changes
	appCfgLock.Lock()
	defer appCfgLock.Unlock()
	return cfg.SaveToFile(filename)
}

// AppSetOverride set js config and saves it to file
func (*service) AppSetOverride(name string, value interface{}) bool {

	var (
		cfg      = config.AppConfig()
		filename = config.OverrideConfigFileName()
	)
	// set to js config
	cfg.SetValue(name, value)
	// save changes
	ovrCfgLock.Lock()
	defer ovrCfgLock.Unlock()
	return cfg.SaveToFile(filename)
}

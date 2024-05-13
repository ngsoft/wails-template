package app

import (
	"goapp/backend/app/config"
	"goapp/backend/util"
)

type Application struct{}

var app = &Application{}

func App() *Application {
	return app
}

func (*Application) Config() *util.Configuration {
	return config.Config()
}

func (a *Application) OnEvent(e *util.Event) {

}

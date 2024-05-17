package service

import (
	"fmt"
	"goapp/backend/app"
)

// Greet returns a greeting for the given name
func (*service) GreetName(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (*service) AppGetConfiguration() map[string]interface{} {
	return app.App().Config().Export()
}

func (*service) AppGetConfig(name string) interface{} {
	return app.App().Config().GetValue(name)
}
func (*service) AppSetConfig(name string, value interface{}) {
	app.App().Config().SetValue(name, value)
}

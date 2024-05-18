package tray

import (
	"context"
	"embed"
	"goapp/backend/app"
	"goapp/backend/app/config"
	"goapp/backend/util"

	"github.com/getlantern/systray"
)

//go:embed icons
var icons embed.FS

type tray struct {
	util.Logger
	cfg   *util.Configuration
	ctx   context.Context
	icons *util.EmbedFs
	items map[*Item]bool
	// reserved buttons
	openWindow *Item
	quit       *Item
	init       bool
}

type Menu struct{}

func (Menu) AddItem(v ...*Item) {
	for _, i := range v {
		instance.items[i] = true
	}
}

var instance = &tray{
	cfg:   config.Config(),
	items: make(map[*Item]bool),
}

//goland:noinspection ALL
func Tray(ctxs ...context.Context) *tray {
	if len(ctxs) > 0 {
		instance.ctx = ctxs[0]
	}
	return instance
}

func Start() {
	if !instance.init {
		instance.init = true
		if !instance.cfg.GetBool("EnableSystray") {
			return
		}
		instance.icons = util.NewEmbedFs(icons, "icons")
		instance.SetLoggerPrefix("[systray]")
		util.AddEventHandler(instance)
		SetupSystray(Menu{})
		systray.Register(instance.onReady, instance.onExit)
	}
}

func (t *tray) onReady() {
	var (
		items   = make([]*Item, 0)
		tooltip = t.cfg.GetString("Tooltip")
	)
	if tooltip == "" {
		tooltip = t.cfg.GetString("Title")
	}
	ico, _ := t.icons.GetFileBytes("icon.ico")
	systray.SetTemplateIcon(ico, ico)
	systray.SetTitle(t.cfg.GetString("Title"))
	systray.SetTooltip(tooltip)

	t.openWindow = NewItem("Show App", func(i *Item) {
		app.ShowWindow()
		i.MenuItem().Hide()
	})
	t.quit = NewItem("Quit", func(i *Item) {
		app.Quit()
	})
	// initialize menus
	if t.cfg.GetBool("HideWindowOnClose") || t.cfg.GetBool("StartHidden") {
		items = append(items, t.openWindow)
		t.openWindow.register()
		if !app.Hidden() {
			t.openWindow.MenuItem().Hide()
		}
	}
	for i := range t.items {
		if i.title == "sep" {
			i.hasHandler = true
			i.running = true
			i.init = true
			systray.AddSeparator()
			continue
		}
		items = append(items, i)
		i.register()
	}
	items = append(items, t.quit)
	t.quit.register()
	for _, h := range items {
		h.run()
	}

}

func (t *tray) onExit() {

	t.Info("stopping app")

}

func (t *tray) OnEvent(e *util.Event) {
	if t.cfg.GetBool("HideWindowOnClose") {
		switch e.Type {
		case app.Hide:
			t.openWindow.MenuItem().Show()
		case app.Show:
			t.openWindow.MenuItem().Hide()
		}
	}
}

package tray

import (
	"github.com/getlantern/systray"
)

type Item struct {
	title      string
	toolTip    string
	checkable  bool
	checked    bool
	children   map[*Item]bool
	menu       *systray.MenuItem
	handler    func(*Item)
	init       bool
	hasHandler bool
	running    bool
}

func NewItemSeparator() *Item {
	return NewItem("sep", ItemNullHandler)
}

func NewItem(title string, handler func(*Item), v ...interface{}) *Item {

	var (
		result    = &Item{title: title, toolTip: title, handler: handler, hasHandler: true, children: make(map[*Item]bool)}
		checkable bool
	)

	for _, i := range v {
		if a, ok := i.(bool); ok {
			if !checkable {
				checkable = true
				result.checkable = a
				continue
			}
			result.checked = a
		} else if a, ok := i.(string); ok {
			result.toolTip = a
		} else if a, ok := i.(*Item); ok {
			result.children[a] = true
		}
	}

	return result

}

func (i *Item) run() {
	if i.running {
		return
	}
	i.running = true
	go func() {
		for range i.menu.ClickedCh {
			i.handler(i)
		}
	}()

	for h := range i.children {
		h.run()
	}

}

func (i *Item) register() {
	if !i.hasHandler {
		panic("please use tray.NewItem()")
	}
	if !i.init {
		i.init = true

		var (
			menu *systray.MenuItem
		)

		if i.checkable {
			menu = systray.AddMenuItemCheckbox(i.title, i.toolTip, i.checked)
		} else {
			menu = systray.AddMenuItem(i.title, i.toolTip)
		}
		i.menu = menu
		for c := range i.children {
			i.makeSubmenu(c)
		}
	}
}

func (i *Item) MenuItem() *systray.MenuItem {
	return i.menu
}

func (i *Item) makeSubmenu(sub *Item) {

	if sub.init {
		panic("invalid submenu")
	}
	sub.init = true
	if !sub.hasHandler {
		sub.handler = i.handler
		sub.hasHandler = true
	}
	var (
		menu *systray.MenuItem
	)
	if sub.checkable {
		menu = i.menu.AddSubMenuItemCheckbox(sub.title, sub.toolTip, sub.checked)
	} else {
		menu = i.menu.AddSubMenuItem(sub.title, sub.toolTip)
	}
	sub.menu = menu
	for c := range sub.children {
		sub.makeSubmenu(c)
	}
}

func ItemNullHandler(*Item) {}

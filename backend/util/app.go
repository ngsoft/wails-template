package util

import (
	"flag"
	"log"
	"os"
	"os/signal"
	"path/filepath"
	"syscall"
)

var (
	globalEvents            EventListener
	started, traps, exiting bool
	executablePath          string
)

func GetExecutablePath(elem ...string) string {
	return filepath.Join(append([]string{executablePath}, elem...)...)
}

func IsStarting() bool {
	return !started
}
func IsRunning() bool {
	return started && !exiting
}
func IsStopping() bool {
	return exiting
}

func AddEventHandler(e EventHandler, v ...EventType) func() {
	return globalEvents.AddEventHandler(e, v...)
}
func RemoveEventHandler(e EventHandler, v ...EventType) {
	globalEvents.RemoveEventHandler(e, v...)
}
func DispatchEvent(e EventType, p ...interface{}) {
	globalEvents.DispatchEvent(e, p...)
}

func setTraps() {
	if !traps {
		traps = true
		sigc := make(chan os.Signal, 1)
		signal.Notify(sigc, os.Interrupt, syscall.SIGTERM, syscall.SIGINT, syscall.SIGQUIT)
		go func() {
			c := <-sigc
			DispatchEvent(SignalEvent, c.String())
			Shutdown(0)
		}()
	}
}

func onStart() {
	started = true
	exe, err := os.Executable()
	if err != nil {
		panic("failed to get executable path")
	}
	executablePath = filepath.Dir(exe)
	DispatchEvent(InitializeEvent)

}

// Initialize to be run first in your application
func Initialize() {
	if !started {
		log.SetFlags(log.LstdFlags | log.Lmicroseconds | log.Lshortfile)
		flag.Parse()
		setTraps()
		onStart()
	}
}

// Start alternative to initialize if you do not want to set traps or flags
func Start() {
	if !started {
		onStart()
	}
}

func Shutdown(code int) {
	if !exiting {
		Stop(code)
		os.Exit(code)
	}
}

// Stop alternative shutdown method (set the state and launch the event)
func Stop(code int) {
	if !exiting {
		exiting = true
		DispatchEvent(ShutdownEvent, code)
	}

}

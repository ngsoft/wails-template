package service

import "fmt"

// Greet returns a greeting for the given name
func (*service) GreetName(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

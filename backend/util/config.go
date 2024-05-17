package util

import "encoding/json"

type Configuration struct {
	pairs map[string]interface{}
	init  bool
}

func (c *Configuration) __init() *Configuration {
	if !c.init {
		c.init = true
		c.pairs = make(map[string]interface{})
	}

	return c
}
func NewConfig(args ...interface{}) *Configuration {

	c := &Configuration{}
	c.__init()
	for _, i := range args {
		if t, ok := i.(map[string]interface{}); ok {
			c.Import(t)
		}
	}
	return c
}
func (c *Configuration) LoadFromFile(file string)       {}
func (c *Configuration) SaveToFile(file string)         {}
func (c *Configuration) Set(n string, v interface{})    { c.__init().pairs[n] = v }
func (c *Configuration) Export() map[string]interface{} { return c.__init().pairs }
func (c *Configuration) ToJson() string {
	var result string = "null"
	if b, err := json.Marshal(c.Export()); err != nil {
		result = string(b)
	}

	return result
}
func (c *Configuration) Import(values map[string]interface{}) {
	c.__init()
	for k, v := range values {
		c.Set(k, v)
	}
}
func (c *Configuration) GetString(n string) string {
	var (
		result string
	)
	if i, ok := c.__init().pairs[n]; ok {
		if v, ok := i.(string); ok {
			result = v
		}
	}
	return result
}

func (c *Configuration) GetBool(n string) bool {
	var (
		result bool
	)
	if i, ok := c.__init().pairs[n]; ok {
		if v, ok := i.(bool); ok {
			result = v
		}
	}
	return result
}
func (c *Configuration) GetInt(n string) int {
	var (
		result int
	)
	if i, ok := c.__init().pairs[n]; ok {
		if v, ok := i.(int); ok {
			result = v
		}
	}
	return result
}

func (c *Configuration) GetInt64(n string) int64 {
	var (
		result int64
	)
	if i, ok := c.__init().pairs[n]; ok {
		if v, ok := i.(int64); ok {
			result = v
		}
	}
	return result
}

func (c *Configuration) GetFloat64(n string) float64 {
	var (
		result float64
	)
	if i, ok := c.__init().pairs[n]; ok {
		if v, ok := i.(float64); ok {
			result = v
		}
	}
	return result
}

func (c *Configuration) GetValue(n string) interface{} {
	var (
		result interface{} = nil
	)
	if i, ok := c.__init().pairs[n]; ok {
		result = i
	}
	return result
}

func (c *Configuration) SetValue(n string, v interface{}) {
	c.__init().pairs[n] = v
}

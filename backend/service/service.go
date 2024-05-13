package service

import "context"

type service struct {
	ctx context.Context
}

var instance = &service{}

func Service(ctxs ...context.Context) *service {
	if len(ctxs) > 0 {
		instance.ctx = ctxs[0]
	}
	return instance
}

package util

import (
	"encoding/json"
	"fmt"
	"io"
	"io/fs"
	"os"
	"path"
	"path/filepath"
	"strconv"

	uuid "github.com/satori/go.uuid"
)

func IsDir(pth string) bool {
	stat, err := os.Stat(pth)
	if err != nil {
		return false
	}
	return stat.IsDir()
}

func IsFile(pth string) bool {
	stat, err := os.Stat(pth)
	if err != nil {
		return false
	}
	return !stat.IsDir()
}

func FindPath(dirName string) (string, bool) {
	var (
		pth  string
		dir  string
		prev string
	)
	dir, _ = os.Getwd()
	for dir != prev {
		prev = dir
		dir = filepath.Dir(dir)
		pth = path.Join(dir, dirName)
		if IsDir(pth) {
			return pth, true
		}
	}
	return "", false
}

func IsSocket(path string) bool {
	fileInfo, err := os.Stat(path)
	if err != nil {
		return false
	}

	return fileInfo.Mode().Type() == fs.ModeSocket
}

func HexToInt(hexString string) int {

	if fmt.Sprintf("%s  ", hexString)[:2] != "0x" {
		hexString = "0x" + hexString
	}

	i, err := strconv.ParseInt(hexString, 0, 64)
	if err != nil {
		return 0
	}
	return int(i)
}

func GenerateUid() string {
	return uuid.NewV4().String()
}

func FileGetContents(fileName string) (string, bool) {

	var (
		handle   *os.File
		err      error
		contents []byte
	)

	if handle, err = os.Open(fileName); err == nil {
		//goland:noinspection ALL
		defer handle.Close()
		contents, err = io.ReadAll(handle)
	}

	return string(contents), err == nil
}

func FilePutContents(fileName string, contents string) bool {

	var (
		dir string
		err error
	)

	dir = filepath.Dir(fileName)
	if err = os.MkdirAll(dir, 0777); err == nil {
		err = os.WriteFile(fileName, []byte(contents), 0664)
	}
	return err == nil
}

func FileGetJson(fileName string) (interface{}, bool) {

	var (
		ok  bool
		err error = nil
		obj interface{}
		str string
	)

	if str, ok = FileGetContents(fileName); ok {
		err = json.Unmarshal([]byte(str), &obj)
	}

	return obj, ok && err == nil
}

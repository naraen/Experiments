package main

import (
	"bufio"
	"fmt"
	"os"
)


//TODO: use commanline parameters
//TODO: block comments
//TODO: can variables exist outside the function block?

func main(){
	var fileName = "/Users/naraen/Experiments/ticTacToe.csv"

	file, _ := os.Open(fileName)
	defer file.Close()

	scanner := bufio.NewScanner(file)

	lineCount := 0
	charCount := 0
	for scanner.Scan() {
        charCount += len(scanner.Text())
        lineCount++
    }

    fmt.Printf("%d chars, %d lines\n", charCount, lineCount)

}

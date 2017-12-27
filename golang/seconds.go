package main

import (
	"fmt"
)

func main() {
	seconds := 90000000000
	days := seconds/24/60/60
	remainingSeconds := seconds - days * 24 * 60 *60
	hours := remainingSeconds/60/60
	remainingSeconds = remainingSeconds - hours * 60 * 60

	fmt.Printf("second %d = %d days, %d hours and %d seconds \n", seconds, days, hours, remainingSeconds)
}

package main

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/twinj/uuid"
	"log"
	"net/http"
	"strconv"
)

type ErrorMessage struct {
	Error string `json:"error, omitempty"`
}

var blankcell byte = 95

type Board struct {
	state         []byte
	currentPlayer string
	stateString   string `json:"state1"`
}

var boards = make(map[string]Board)

func main() {

	router := mux.NewRouter()
	router.HandleFunc("/boards/", GetBoard).Methods("GET")
	router.HandleFunc("/boards/", CreateBoard).Methods("POST")
	router.HandleFunc("/boards/{boardId}/positions/{cellId}", SetCellPostition).Methods("PUT")

	log.Print("board ", boards)
	log.Fatal(http.ListenAndServe(":8000", router))
}

func CreateBoard(w http.ResponseWriter, r *http.Request) {
	boardGuid := uuid.NewV4()
	log.Print("Guid", boardGuid.String())
	boardId := boardGuid.String()

	boards[boardId] = Board{
		state:         []byte{blankcell, blankcell, blankcell, blankcell, blankcell, blankcell, blankcell, blankcell, blankcell},
		currentPlayer: "X",
	}

	w.Header().Set("Location", "/boards/"+boardId+"/")
	json.NewEncoder(w).Encode(boards)
}

func GetBoard(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(boards)
}

func SetCellPostition(w http.ResponseWriter, r *http.Request) {
	var params = mux.Vars(r)

	player := r.Header["X-Ttt-Player-Id"][0]
	cellIdx, _ := strconv.Atoi(params["cellId"])
	boardId, _ := params["boardId"]

	if player != "X" && player != "O" {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(ErrorMessage{Error: "Who are you?"})
		return
	}

	board, ok := boards[boardId]

	if !ok {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(ErrorMessage{Error: "I don't know this board"})
		return
	}

	if player != board.currentPlayer {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorMessage{Error: "Not your turn"})
		return
	}

	if board.state[cellIdx] != blankcell {
		w.WriteHeader(http.StatusConflict)
		json.NewEncoder(w).Encode(ErrorMessage{Error: "Hey!  That's cheating. This cell is already taken"})
		return
	}

	log.Print(board)
	if boards[boardId].currentPlayer == "X" {
//TODO: Why does this not work when I use boards[boardId].currentPlayer = "O"
		board.state[cellIdx] = 88
		board.currentPlayer = "O"

	} else {
		board.state[cellIdx] = 79
		board.currentPlayer = "X"
	}

	board.stateString = string(boards[boardId].state)

	log.Print(boards)
	json.NewEncoder(w).Encode( board.stateString )

}

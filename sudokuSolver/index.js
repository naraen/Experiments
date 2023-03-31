(function () {
  "use strict";

  const repl = require("./repl.js");
  const Grid = require("./grid.js").grid;
  const gridSetLogLevel = require("./grid.js").setLogLevel;

  const readline = require("readline");

  //TODO: propagate naked twins.
  //TODO: Rename findsingle to findOnlyOnce
  //TODO: Rename sets to peers
  //TODO: query for solved count
  //TODO: solve count at the end of every operation.
  //TODO: rewind hint
  //TODO: investigate why parser  error spew shown in stdout/stderr is not suppresed by try-catch - Don
  //TODO: fix ambiguity in grammar. Done.
  //TODO: add help command in grammar
  //TODO: forgive lack of spacing in cellIdx = value syntax.  Done
  //TODO: implement quit command in the grammar - DONE
  //TODO: Enforce numbers to be int
  //TODO: Change internal cellIdx to be RowCol reference instead of array index reference

  var inputThroughConsole = "";
  var boolIsDoneReceiving = true;
  var gridFromConsoleInput;
  var hintHistory = [];
  var stash = [];

  function receiveInput(input) {
    inputThroughConsole += (input || "").toString().replace(/[^0-9]/g, "");

    boolIsDoneReceiving =
      inputThroughConsole.replace(/[ \n\t]/g, "").length == 81;

    if (boolIsDoneReceiving) {
      var formattedInput = inputThroughConsole;
      console.log(
        "Received Input",
        "\n\t" + inputThroughConsole.replace(/([0-9]{9})/g, "$1\n\t")
      );
      gridFromConsoleInput = new Grid(inputThroughConsole);
    }
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  rl.on("line", (line) => {
    if (line.indexOf("quit") > -1) {
      rl.close();
      return;
    }

    if (!boolIsDoneReceiving) {
      receiveInput(line);
      return;
    }

    try {
      var { commandId, command } = repl.parseInput(line);
      if (commandId != undefined) {
        runCommand(commandId, command);
      }
    } catch (e) {
      console.error("Error while parsing input", line);
      console.error(e);
      console.log("¯\\_(ツ)_/¯!");
    }
  });

  function inputToCellIdx(inp) {
    return parseInt(inp / 10 - 1) * 9 + (inp % 10) - 1;
  }

  function runCommand(commandId, command) {
    switch (commandId) {
      case "init_grid":
        inputThroughConsole = "";
        hintHistory = [];
        receiveInput(command.numbers);
        break;
      case "show_grid":
        var formattedGrid = gridFromConsoleInput.getGridForDisplay();

        if (command.numbers != undefined) {
          //TODO: why is numbers not being post processed?
          //https://en.wikipedia.org/wiki/ANSI_escape_code#Colors
          //Highlighing number in red.
          var pattern = command.numbers.value;
          formattedGrid = formattedGrid.replaceAll(
            pattern,
            "\x1b[31m" + pattern + "\x1b[0m"
          );
        }
        console.log(formattedGrid);
        break;
      case "rewind_grid":
        if (stash.length > 0) {
          var prevState = stash.pop();
          gridFromConsoleInput = new Grid(prevState);
        }
        break;
      case "reset_grid":
        if (inputThroughConsole.length != 81) {
          console.log("! No current grid");
          return;
        }
        gridFromConsoleInput = new Grid(inputThroughConsole);
        break;
      case "show_input":
        console.log(`\n\t${inputThroughConsole
          .replace(/([0-9]{3})/g, "$1 ")
          .replace(/([0-9 ]{12})/g, "$1\n\t")}
        `);
        break;
      case "show_unsolved_count":
        console.log(gridFromConsoleInput.unsolvedCount(), "unsolved cells");
        break;
      case "show_hint_history":
        console.log(JSON.stringify(hintHistory, null, 2));
        break;
      case "is_it_solved":
        console.log(gridFromConsoleInput.isSolved() ? "Yes" : "No");
        break;
      case "is_it_stuck":
        console.log(gridFromConsoleInput.isHalted() ? "Yes" : "No");
        break;
      case "is_it_correct":
        console.log(gridFromConsoleInput.checkForCorrectness() ? "Yes" : "No");
        break;
      case "use_only_choice":
        var currentState = gridFromConsoleInput.serialize();
        stash.push(currentState);
        gridFromConsoleInput.findSingleCandidates();
        break;
      case "use_brute_force":
        var currentState = gridFromConsoleInput.serialize();
        stash.push(currentState);
        var hints = gridFromConsoleInput.useBruteForce();
        console.log(`hints = ${JSON.stringify(hints)}`);
        break;
      case "debug_on":
        gridSetLogLevel("Debug");
        break;
      case "debug_off":
        gridSetLogLevel("NOP");
        break;
      case "use_hint":
        var { cellIdx, value } = command;
        if (isNaN(cellIdx) || isNaN(value)) {
          console.log("could not parse hints", command);
        } else {
          cellIdx = inputToCellIdx(cellIdx);
          console.log(`Received hint.  ${cellIdx} = ${value}`);
          hintHistory.push([cellIdx, value]);
          var currentState = gridFromConsoleInput.serialize();
          stash.push(currentState);
          gridFromConsoleInput.useHints([[cellIdx, value]]);
        }
        break;
      case "set_value":
        var { cellIdx, value } = command;
        if (isNaN(cellIdx) || isNaN(value)) {
          console.log("could not parse command", command);
        } else {
          cellIdx = inputToCellIdx(cellIdx);
          console.log(`Applying.  ${cellIdx} = ${value}`);
          var currentState = gridFromConsoleInput.serialize();
          stash.push(currentState);
          gridFromConsoleInput.setValue(cellIdx, value);
        }
        break;
      case "remove_value":
        var { cellIdx, value } = command;
        if (isNaN(cellIdx) || isNaN(value)) {
          console.log("could not parse command", command);
        } else {
          cellIdx = inputToCellIdx(cellIdx);
          console.log(`Applying.  ${cellIdx} != ${value}`);
          var currentState = gridFromConsoleInput.serialize();
          stash.push(currentState);
          gridFromConsoleInput.removeCandidate(cellIdx, value);
        }

        break;
      default:
        console.log("¯\\_(ツ)_/¯");
    }
  }
})();

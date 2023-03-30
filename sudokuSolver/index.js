(function () {
  "use strict";

  const fs = require("fs");
  const Grid = require("./grid.js").grid;
  const gridSetLogLevel = require("./grid.js").setLogLevel;
  const nearley = require("nearley");
  const grammar = require("./repl_grammar.js");

  const readline = require("readline");

  //TODO: propagate naked twins.
  //TODO: Rename findsingle to findOnlyOnce
  //TODO: Rename sets to peers
  //TODO: query for solved count
  //TODO: solve count at the end of every operation.
  //TODO: rewind hint
  //TODO: investigate why parser  error spew shown in stdout/stderr is not suppresed by try-catch
  //TODO: fix ambiguity in grammar.
  //TODO: add help command in grammar
  //TODO: forgive lack of spacing in cellIdx = value syntax
  //TODO: implement quit command in the grammar

  var inputThroughConsole = "";
  var boolIsDoneReceiving = true;
  var gridFromConsoleInput;
  var hintHistory = [];

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
    if (!boolIsDoneReceiving) {
      receiveInput(line);
      return;
    }

    try {
      const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
      parser.feed(line.replace(/\\n/, "\n"));
      var result = parser.results;
      //Parsing returns nested arrays since grammar us ambigous.
      //This is a temporary hack until we cleanup the grammar.
      while (Array.isArray(result)) result = result[0];
      var command = result;

      runCommand(command);
    } catch (e) {
      console.error("Error while parsing input", line);
      console.error(e);
      console.log("¯\\_(ツ)_/¯");
    }
  });

  const commandChart = [
    { usecase: "init_grid", verb: "init", object: "grid" },
    { usecase: "reset_grid", verb: "reset", object: "grid" },
    { usecase: "show_grid", verb: "show", object: "grid" },
    { usecase: "show_input", verb: "show", object: "input" },
    {
      usecase: "show_unsolved_count",
      verb: "show",
      object: "unsolved",
      qualifier: "count",
    },
    {
      usecase: "show_hint_history",
      verb: "show",
      object: "hint",
      qualifier: "history",
    },
    { usecase: "is_it_solved", verb: "is", object: "it", qualifier: "solved" },
    { usecase: "is_it_stuck", verb: "is", object: "it", qualifier: "stuck" },
    {
      usecase: "is_it_correct",
      verb: "is",
      object: "it",
      qualifier: "correct",
    },
    { usecase: "debug_on", verb: "set", object: "debug", qualifier: "on" },
    { usecase: "debug_off", verb: "set", object: "debug", qualifier: "off" },
    { usecase: "set_value", verb: "set", object: "value" },
    { usecase: "remove_value", verb: "remove", object: "value" },
    { usecase: "use_hint", verb: "use", object: "hint" },
    { usecase: "use_only_choice", verb: "use", strategy: "only choice" },
    { usecase: "use_brute_force", verb: "use", strategy: "brute force" },
  ];

  function findUseCase(command) {
    if (command == undefined) return;

    return commandChart.reduce((usecase, c) => {
      if (usecase !== null) return usecase;

      var isMatch = Object.keys(c).reduce((b, k) => {
        if (k == "usecase") return b;

        return b && c[k] == command[k];
      }, true);

      return isMatch ? c.usecase : usecase;
    }, null);
  }

  function runCommand(command) {
    var usecase = findUseCase(command);
    //console.log(usecase, command);
    switch (usecase) {
      case "init_grid":
        inputThroughConsole = "";
        hintHistory = [];
        receiveInput(command.numbers);
        return;
        break;
      case "show_grid":
        console.log(gridFromConsoleInput.getGridForDisplay());
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
        gridFromConsoleInput.findSingleCandidates();
        break;
      case "use_brute_force":
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
        console.log(153, command);
        if (isNaN(cellIdx) || isNaN(value)) {
          console.log("could not parse hints", command);
        } else {
          console.log(`Received hint.  ${cellIdx} = ${value}`);
          hintHistory.push([cellIdx, value]);
          gridFromConsoleInput.useHints([[cellIdx, value]]);
        }
        break;
      case "set_value":
        var { cellIdx, value } = command;
        if (isNaN(cellIdx) || isNaN(value)) {
          console.log("could not parse command", command);
        } else {
          console.log(`Applying .  ${cellIdx} = ${value}`);
          gridFromConsoleInput.useHints([cellIdx, value]);
        }
        break;
      case "remove_value":
        var { cellIdx, value } = command;
        if (isNaN(cellIdx) || isNaN(value)) {
          console.log("could not parse command", command);
        } else {
          console.log(`Applying .  ${cellIdx} != ${value}`);
          gridFromConsoleInput.removeCandidate(cellIdx, value);
        }

        break;
      default:
        console.log("¯\\_(ツ)_/¯");
    }
  }
})();

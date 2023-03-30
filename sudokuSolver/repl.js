(function () {
  "use strict"
  const nearley = require("nearley");
  const grammar = require("./repl_grammar.js");

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

  function parseInput(input) {
      const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
      parser.feed(input.replace(/\\n/, "\n"));
      var result = parser.results;
      //Parsing returns nested arrays since grammar us ambigous.
      //This is a temporary hack until we cleanup the grammar.
      while (Array.isArray(result)) result = result[0];
      var command = result;
      var commandId = findCommandId(command);
      return {commandId, command};
  }

   function findCommandId(command) {
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

  module.exports = { parseInput }
 })()
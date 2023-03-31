(function () {
  "use strict";
  const repl = require("../repl.js");
  const validInputs = [
    { input: "init grid 123 456", commandId: "init_grid" },
    { input: "init grid 123456", commandId: "init_grid" },
    { input: "show grid", commandId: "show_grid" },
    { input: "reset grid", commandId: "reset_grid" },
    { input: "use hint 1=5", commandId: "use_hint" },
    { input: "use hint 1 = 5", commandId: "use_hint" },
    { input: "use hint 1 = 52", commandId: "use_hint" },
    { input: "remove value 1=52", commandId: "remove_value" },
    { input: "set debug on", commandId: "debug_on" },
    { input: "set debug off", commandId: "debug_off" },
    { input: "is it solved", commandId: "is_it_solved" },
    { input: "is it stuck", commandId: "is_it_stuck" },
    { input: "is it correct", commandId: "is_it_correct" },
    { input: "show hint history", commandId: "show_hint_history" },
    { input: "show unsolved count", commandId: "show_unsolved_count" },
    { input: "use only choice", commandId: "use_only_choice" },
    { input: "use brute force", commandId: "use_brute_force" },
  ];

  validInputs.forEach((t) => {
    test(t.input, () => {
      var { commandId } = repl.parseInput(t.input);
      expect(commandId).toBe(t.commandId);
    });
  });
})();

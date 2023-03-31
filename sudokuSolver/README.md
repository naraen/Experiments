# Sudoku Solver

This is a sudoku solver that I worked on to brush up on nodejs and javascript. It is intended to  primarily be used interactively through a [repl](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop).  

However, it is well modularized and it is possible to import the solver and run it progrmatically. 

It uses [Nearley parser](https://nearley.js.org/) with [moo tokenizer](http://github.com/tjvr/moo)  for processing the repl input. 

It supports a few solving strategies.
 1. Eliminate
 2. Only choice
 3. Naked Twins (not implemented yet)
 4. Brute Force


## Getting started

In your command terminal
```
    git clone <<repository>>
    npm install 
    npm start
```

This will drop you into a repl. In the repl you can input and interact with a grid. The


## Interactive Commands
The repl supports the following commands

**init grid**  <81 numbers as input>

Initialize the solver with the puzzle to work on. 

The command expects 81 numbers.  Unsolved cells should be represented by 0.   If there is a mistake while entering numbers, entering `init grid` on a newline, will restart the sequence.

The command is forgiving of white spaces (tabs, blanks, newlines) while entering numbers.    The following are equally valid ways to initialize same puzzle.

```
  init grid 000100290003020600000090000100008000300071000296000000060000003005000010000504007

  init grid 000100290
	003020600
	000090000
	100008000
	300071000
	296000000
	060000003
	005000010
	000504007

  init grid 
  005 200 070 
  003 001 000 
  020 000 005 
  670 000 480 
  001 900 000 
  000 700 300 
  084 050 600 
  100 004 000 
  090 000 007 

```

**Eliminate**

The eliminate strategy eliminates value of a solved cell from other cells in a set.   
```
E.g. When Row 1, Column 1 is 5.  This strategy eliminates 5 as candidate from all other other in Row 1, Col 1 and Box 1. 
```
The solver automatically applies the Eliminate strategy after processing any user command that modifies the grid. There is no interactive command to use this strategy.

**show grid** [number]

Outputs the grid to the console in a 9 x 9 format.  For unsolved cells possible values are shown.

The number is optional.  If provided, the number is highlighted in red for ease of spotting patterns.
``` 
   E.g. show grid 7
   
   will cause all number 7 in the grid to be highlighted in red.
```

**set value**  *cellIdx* = *value*

Sets the value of the cell identified by cellIdx to the specified value.  The state of the grid before modification is saved, to enable future rewind.  Applies eliminate strategy after setting the value.    

```
  E.g. set value 23 = 7
  
  will cause cell in Row 2, Column 3 to be set to 7
```
cellidx: Should be a 2 digit number.  

The first digit indicates the row number (1 to 9). The second digit indicates the column number (1 to 9)

value : Should be a non zero number.  

Solver treats single digit number as a solve for the cell and propagates the solve. 

Multi-digit numbers are treated as possible candidates and the current candidate list is overwritten.


**is it stuck** 

Responds with a 'Yes' if the solver encountered a conflict while propagating the values and stopped.  Otherwise responds with a 'No'.

**is it solved** 

Responds with a 'Yes' if all cells in the grid have only a single value. Responds with a 'No' if any cell has two or more candidate values.  

Note that a grid can be solved but still have conflicts.   Use `is it stuck` or `is it correct` to validate.

**is it correct**

Responds with 'Yes' if all sets - row, column and box, has each number 1 - 9 exactly once.   Otherwise returns 'No'. 

**reset grid**

Discards all interactive modifications to the grid and restores to the state initialized by `init grid`. 

**rewind grid**

Restores the grid to the state before the last modification.  For example modification using `set value`.

**remove value** *cellIdx* = *value*


Removes the value from the cell identified by cellIdx.  Grid state is saved to enable a rewind.  

Cell is interpreted as solved if only one value is left after removal and the solve is propagated to the rest of the grid. 

cellIdx: Should be a 2 digit number.  

The first digit indicates the row number (1 to 9). The second digit indicates the column number (1 to 9)

value : Should be a non-zero number.  Can be single digit or multi-digit.  If it is multi-digit, each digit will be removed from the candidate list.  Removing the last digit will trigger a conflict and cause the solver to halt.  


**use hint** *cellIdx* = *value*

Same as set value, except that a list of hints used can be viewed with `show hint history`.   This is useful, to keep track, when trying different solves. 

**show hint history**
Displays a list hints applied so far. 

**set debug** *on*
**set debug** *off

Solver outputs step by step internal details as it runs through its logic.  Useful for understanding how the solver arrived at the solution and for troubleshooting errors. 

**use only choice** 

Applies the 'Only Choice' strategy.   

Analyzes candidate values of each unsolved cell in a set, to find any candidate value that exist in exactly one cell.  Solves all such cell that it finds. 

This strategy will run repeatedly until no more solves are found. 

**use brute force**

Attempts to solve the grid through brute force.   

Starting with the first unsolved cell, sets cell value to one of the candidate values and propagates the solves.   If the propagation results in a conflict it backtracks and tries a diferent value for the cell.  It repeats this, until the grid is solved or iteration limit is reached.

Current iteration limit is 50.

## Using the solver programmatically
<< coming soon >>


## References
- [The math behind Sudoku] (http://pi.math.cornell.edu/~mec/Summer2009/Mahmood/Home.html)
- [How to make a parser with Nearley.js - Part 1](https://www.youtube.com/watch?v=51XwG1W2ysU)





















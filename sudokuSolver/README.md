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

### init grid  
```
    init grid <81 digits as input>
```

Initializes the solver with the puzzle to work on. 

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

### Eliminate

The eliminate strategy eliminates value of a solved cell from other cells in a set.   

```
    E.g. When Row 1, Column 1 is 5.  This strategy eliminates 5 as candidate from all other other in Row 1, Col 1 and Box 1. 
```

The solver automatically applies the Eliminate strategy after processing any user command that modifies the grid. There is no interactive command to use this strategy.

### show grid
```
 show grid [number]
```

Outputs the grid to the console in a 9 x 9 format.  For unsolved cells possible values are shown.

The number is optional.  If provided, the number is highlighted in red for ease of spotting patterns.

``` 
E.g. show grid 7

will cause all number 7 in the grid to be highlighted in red.
```

### set value
```
  set value  <cellIdx> = <value>
```

Sets the value of the cell identified by cellIdx to the specified value.  The state of the grid before modification is saved, to enable future rewind.  Applies eliminate strategy after setting the value.    

```
E.g. set value 23 = 7

will cause cell in Row 2, Column 3 to be set to 7
```
*cellIdx*: Should be a 2 digit number.  

The first digit indicates the row number (1 to 9). The second digit indicates the column number (1 to 9)

*value* : Should be a non zero number.  

Solver treats single digit number as a solve for the cell and propagates the solve. 

Multi-digit numbers are treated as possible candidates and the current candidate list is overwritten.


### is it stuck
```
    is it stuck
```

Responds with a 'Yes' if the solver encountered a conflict while propagating the values and stopped.  Otherwise responds with a 'No'.

### is it solved
```
    is it solved
```
Responds with a 'Yes' if all cells in the grid have only a single value. Responds with a 'No' if any cell has two or more candidate values.  

Note that a grid can be solved but still have conflicts.   Use `is it stuck` or `is it correct` to validate.

### is it correct
```
    is it correct
```
Responds with 'Yes' if all sets - row, column and box, has each number 1 - 9 exactly once.   Otherwise returns 'No'. 

### reset grid
```
    reset grid
```

Discards all interactive modifications to the grid and restores to the state initialized by `init grid`. 

### rewind grid
```
    rewind grid
```

Restores the grid to the state before the last modification.  For example modification using `set value`.

### remove value
```
    remove value <cellIdx> = <value>
```

Removes the value from the cell identified by cellIdx.  The grid state is saved to enable a rewind.  

Cell is interpreted as solved if only one value is left after removal and the solve is propagated to the rest of the grid. 

*cellIdx*: Should be a 2 digit number.  

The first digit indicates the row number (1 to 9). The second digit indicates the column number (1 to 9)

*value* : Should be a non-zero number.  Can be single digit or multi-digit.  If it is multi-digit, each digit will be removed from the candidate list.  Removing the last digit will trigger a conflict and cause the solver to halt.  


### use hint
```
    use hint <cellIdx> = <value>
```

Same as set value, except that a list of hints used can be viewed with `show hint history`.   This is useful, to keep track, when trying different solves. 

### show hint history
```
    show hint history
```
Displays a list hints applied so far. 

### set debug
```
    set debug on|off
```

Solver outputs step by step internal details as it runs through its logic.  Useful for understanding how the solver arrived at the solution and for troubleshooting errors. 

### use only choice
```
    use only choice
```
Applies the 'Only Choice' strategy to the grid.   

Analyzes candidate values of each unsolved cell in a set, to find any candidate value that exist in exactly one cell.  Solves all such cell that it finds. 

This strategy will run repeatedly until no more solves are found. 

### use brute force
```
    use brute force
```
Attempts to solve the grid through brute force.   

Starting with the first unsolved cell, sets cell value to one of the candidate values and propagates the solves.   If the propagation results in a conflict it backtracks and tries a diferent value for the cell.  It repeats this, until the grid is solved or iteration limit is reached.

Current iteration limit is 50.

## Example interactive session

```
user@machinename sudokuSolver % npm start

> start
> npx nearleyc -o repl_grammar.js repl_language.ne && node index.js 2> err.out

>init grid 
000 100 290
003 020 600
000 090 000

100 008 000
300 071 000
296 000 000 

060 000 003
005 000 010
000 504 007
Received Input 
	000100290
	003020600
	000090000
	100008000
	300071000
	296000000
	060000003
	005000010
	000504007

>mistyped command
¯\_(ツ)_/¯!

>show grid

================================================================================================
||    45678|     4578|      478||        1|    34568|     3567||        2|        9|      458||
||    45789|    14578|        3||      478|        2|       57||        6|     4578|     1458||
||    45678|   124578|    12478||    34678|        9|     3567||   134578|    34578|     1458||
================================================================================================
||        1|      457|       47||    23469|     3456|        8||    34579|   234567|    24569||
||        3|      458|       48||     2469|        7|        1||     4589|    24568|   245689||
||        2|        9|        6||       34|      345|       35||   134578|    34578|     1458||
================================================================================================
||     4789|        6|   124789||     2789|       18|      279||     4589|     2458|        3||
||     4789|    23478|        5||   236789|      368|    23679||      489|        1|    24689||
||       89|     1238|     1289||        5|     1368|        4||       89|      268|        7||
================================================================================================

>is it solved
No

>show unsolved count
59 unsolved cells

>use only choice
  Setting 9 = 9
  Setting 56 = 9
  Setting 58 = 1
  Setting 68 = 9
  Setting 59 = 2

>show grid
================================================================================================
||     4567|     4578|      478||        1|    34568|     3567||        2|        9|      458||
||        9|    14578|        3||      478|        2|       57||        6|     4578|     1458||
||     4567|   124578|    12478||    34678|        9|     3567||   134578|    34578|     1458||
================================================================================================
||        1|      457|       47||    23469|     3456|        8||     3457|   234567|    24569||
||        3|      458|       48||     2469|        7|        1||      458|    24568|   245689||
||        2|        9|        6||       34|      345|       35||   134578|    34578|     1458||
================================================================================================
||       47|        6|        9||       78|        1|        2||      458|      458|        3||
||       47|     2347|        5||     3678|      368|        9||       48|        1|     2468||
||        8|      123|       12||        5|       36|        4||        9|       26|        7||
================================================================================================
> is it solved
No

> is it stuck
No

>show unsolved count
52 unsolved cells

>rewind grid

>show grid

================================================================================================
||    45678|     4578|      478||        1|    34568|     3567||        2|        9|      458||
||    45789|    14578|        3||      478|        2|       57||        6|     4578|     1458||
||    45678|   124578|    12478||    34678|        9|     3567||   134578|    34578|     1458||
================================================================================================
||        1|      457|       47||    23469|     3456|        8||    34579|   234567|    24569||
||        3|      458|       48||     2469|        7|        1||     4589|    24568|   245689||
||        2|        9|        6||       34|      345|       35||   134578|    34578|     1458||
================================================================================================
||     4789|        6|   124789||     2789|       18|      279||     4589|     2458|        3||
||     4789|    23478|        5||   236789|      368|    23679||      489|        1|    24689||
||       89|     1238|     1289||        5|     1368|        4||       89|      268|        7||
================================================================================================

>show grid 9

================================================================================================
||    45678|     4578|      478||        1|    34568|     3567||        2|        9|      458||
||    45789|    14578|        3||      478|        2|       57||        6|     4578|     1458||
||    45678|   124578|    12478||    34678|        9|     3567||   134578|    34578|     1458||
================================================================================================
||        1|      457|       47||    23469|     3456|        8||    34579|   234567|    24569||
||        3|      458|       48||     2469|        7|        1||     4589|    24568|   245689||
||        2|        9|        6||       34|      345|       35||   134578|    34578|     1458||
================================================================================================
||     4789|        6|   124789||     2789|       18|      279||     4589|     2458|        3||
||     4789|    23478|        5||   236789|      368|    23679||      489|        1|    24689||
||       89|     1238|     1289||        5|     1368|        4||       89|      268|        7||
================================================================================================

> set value 21=9
Applying.  21 = 9

> show grid 9

================================================================================================
||     4567|         |      478||        1|    34568|     3567||        2|        9|      458||
||        9|    14578|        3||      478|        2|       57||        6|     4578|     1458||
||     4567|   124578|    12478||    34678|        9|     3567||   134578|    34578|     1458||
================================================================================================
||        1|      457|       47||    23469|     3456|        8||     3457|   234567|    24569||
||        3|      458|       48||     2469|        7|        1||      458|    24568|   245689||
||        2|        9|        6||       34|      345|       35||   134578|    34578|     1458||
================================================================================================
||       47|        6|    12479||     2789|       18|      279||      458|     2458|        3||
||       47|     2347|        5||   236789|      368|    23679||       48|        1|     2468||
||        8|      123|       12||        5|      136|        4||        9|       26|        7||
================================================================================================

> show unsolved count
55 unsolved cells

> use only choice
  Setting 56 = 9
  Setting 58 = 1
  Setting 68 = 9
  Setting 59 = 2

> show grid

================================================================================================
||     4567|        9|      478||        1|    34568|     3567||        2|        9|      458||
||        9|    14578|        3||      478|        2|       57||        6|     4578|     1458||
||     4567|   124578|    12478||    34678|        9|     3567||   134578|    34578|     1458||
================================================================================================
||        1|      457|       47||    23469|     3456|        8||     3457|   234567|    24569||
||        3|      458|       48||     2469|        7|        1||      458|    24568|   245689||
||        2|        9|        6||       34|      345|       35||   134578|    34578|     1458||
================================================================================================
||       47|        6|        9||       78|        1|        2||      458|      458|        3||
||       47|     2347|        5||     3678|      368|        9||       48|        1|     2468||
||        8|      123|       12||        5|       36|        4||        9|       26|        7||
================================================================================================

> remove value 11=47
Applying.  0 != 47

> remove value 31=47
Applying.  18 != 47

> show grid    

================================================================================================
||       56|        9|      478||        1|    34568|     3567||        2|        9|      458||
||        9|    14578|        3||      478|        2|       57||        6|     4578|     1458||
||       56|   124578|    12478||    34678|        9|     3567||   134578|    34578|     1458||
================================================================================================
||        1|      457|       47||    23469|     3456|        8||     3457|   234567|    24569||
||        3|      458|       48||     2469|        7|        1||      458|    24568|   245689||
||        2|        9|        6||       34|      345|       35||   134578|    34578|     1458||
================================================================================================
||       47|        6|        9||       78|        1|        2||      458|      458|        3||
||       47|     2347|        5||     3678|      368|        9||       48|        1|     2468||
||        8|      123|       12||        5|       36|        4||        9|       26|        7||
================================================================================================

> set value 54=9
Applying.  39 = 9

> show unsolved count
50 unsolved cells

> use only choice
  Setting 30 = 2
  Setting 35 = 9
  Setting 31 = 6
  Setting 5 = 3
  Setting 43 = 2
  Setting 44 = 6
  Setting 2 = 7
  Setting 17 = 5
  Setting 34 = 4

> is it solved
Yes

> show unsolved count
0 unsolved cells

> show grid
================================================================================================
||        6|        7|        8||        1|        5|        3||        2|        9|        4||
||        9|        1|        3||        4|        2|        7||        6|        8|        5||
||        5|        4|        2||        8|        9|        6||        7|        3|        1||
================================================================================================
||        1|        5|        7||        2|        6|        8||        3|        4|        9||
||        3|        8|        4||        9|        7|        1||        5|        2|        6||
||        2|        9|        6||        3|        4|        5||        1|        7|        8||
================================================================================================
||        4|        6|        9||        7|        1|        2||        8|        5|        3||
||        7|        3|        5||        6|        8|        9||        4|        1|        2||
||        8|        2|        1||        5|        3|        4||        9|        6|        7||
================================================================================================

> is it stuck
No

> is it solved
Yes

> is it correct
Yes

```

## Using the solver programmatically
<< coming soon >>


## References
- [The math behind Sudoku] (http://pi.math.cornell.edu/~mec/Summer2009/Mahmood/Home.html)
- [How to make a parser with Nearley.js - Part 1](https://www.youtube.com/watch?v=51XwG1W2ysU)





















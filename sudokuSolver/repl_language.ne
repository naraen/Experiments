@{%
	const moo= require('moo');

	const keywords = {
	    'command': ['show', 'use', 'init', 'reset', 'set', 'remove', 'is'],
	    'object': ['grid', 'hint', 'value', 'it', 'unsolved', 'debug', 'input' ],
	    'qualifier' : ['solved', 'stuck', 'correct', 'history', 'count', 'on', 'off'],
	    'strategy_word' : ['brute', 'force', 'only', 'choice']
	}

	const lexer = moo.compile({
	  word: {match: /[a-zA-Z]+/, type: moo.keywords(keywords)},
	  ws : /[ \t]/,
	  eq : '=',
	  number : /[0-9]+/,
	  newline : {match :'\n', lineBreaks:true}
	})
%}


@lexer lexer

start ->  commands {% id %}

commands -> command {% (t) => [t[0]] %}
		| command %newline:+ commands
			{% (t) => [t[0], ... t[2]]%}

command -> %command __ %object _
			{% (t) => ({
				verb: t[0].value, 
				object: t[2].value
			}) %}

		| %command __ %object __ %number _ %eq _ %number 
			{% (t) => ({
				verb: t[0].value,
				object:  t[2].value,
				cellIdx: Number(t[4].value),
				operator:  t[6].value, 
				value: Number(t[8].value) 
			}) %}

		| %command __ %object __ numbers
			{% (t) => ({
				verb: t[0].value, 
				object : t[2].value, 
				numbers : t[4]
			}) %}

		| %command __ %object __ %qualifier
			{% (t) => ({
				verb : t[0].value, 
				object : t[2].value, 
				qualifier : t[4].value 
			}) %}

		| %command __ strategy
			{% (t) => ({
				verb : t[0].value, 
				strategy : t[2] 
			}) %}

numbers -> %number {% id %}
		| %number _ numbers {% (t) => t.join('') %}

strategy -> %strategy_word {% id %}
		| %strategy_word __ strategy {% (t) => t.join("") %} 


__ -> %ws:+

_ -> %ws:*


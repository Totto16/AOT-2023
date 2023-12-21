type RockPaperScissors = "👊🏻" | "🖐🏾" | "✌🏽"

type WhoWins<First extends string, Second extends string> = First extends Second
	? "draw"
	: First extends "✌🏽"
	? Second extends "👊🏻"
		? "win"
		: "lose"
	: First extends "👊🏻"
	? Second extends "🖐🏾"
		? "win"
		: "lose"
	: First extends "🖐🏾"
	? Second extends "✌🏽"
		? "win"
		: "lose"
	: never

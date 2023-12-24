type Connect4Chips = "🔴" | "🟡"
type Connect4EmpytState = "  "
type Connect4Cell = Connect4Chips | Connect4EmpytState
type Connect4State = "🔴" | "🟡" | "🔴 Won" | "🟡 Won" | "Draw"

type Length<T extends any[]> = T["length"]

type Succ<S, T extends S[]> = [...T, S]
type Succ2<T extends unknown[]> = [...T, ""]

type MyArray<T, AM extends number, Z extends T[] = []> = AM extends Length<Z>
	? Z
	: MyArray<T, AM, Succ<T, Z>>

type Row = MyArray<Connect4Cell, 7>
type BoardRowNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6

type Board = MyArray<Row, 6>

type BoardColumnNumber = 0 | 1 | 2 | 3 | 4 | 5

type Game = {
	board: Board
	state: Connect4State
}

type EmptyBoard = [
	["  ", "  ", "  ", "  ", "  ", "  ", "  "],
	["  ", "  ", "  ", "  ", "  ", "  ", "  "],
	["  ", "  ", "  ", "  ", "  ", "  ", "  "],
	["  ", "  ", "  ", "  ", "  ", "  ", "  "],
	["  ", "  ", "  ", "  ", "  ", "  ", "  "],
	["  ", "  ", "  ", "  ", "  ", "  ", "  "]
]

type NewGame = {
	board: EmptyBoard
	state: "🟡"
}

type GetPosition<
	G extends Row[],
	S extends BoardRowNumber,
	Counter extends unknown[] = []
> = Length<G> extends 0
	? never
	: Length<G> extends 1
	? G[0][S] extends Connect4EmpytState
		? [S, Length<Counter>]
		: never
	: G extends [...infer A1 extends Row[], infer A2 extends Row]
	? A2[S] extends Connect4EmpytState
		? [S, Length<Counter>]
		: GetPosition<A1, S, Succ2<Counter>>
	: never

type ChangeArray<
	T extends Connect4Cell[],
	Num extends BoardRowNumber,
	Replace extends Connect4Chips,
	Cnt extends unknown[] = []
> = T extends [
	infer A1 extends Connect4Cell,
	...infer A2 extends Connect4Cell[]
]
	? Length<Cnt> extends Num
		? [Replace, ...A2]
		: [A1, ...ChangeArray<A2, Num, Replace, Succ2<Cnt>>]
	: Length<T> extends 1
	? Length<Cnt> extends Num
		? [Replace]
		: [T[0]]
	: Length<T> extends 0
	? []
	: never

type Change<
	T extends Row,
	S extends [BoardRowNumber, BoardColumnNumber],
	Num extends BoardRowNumber,
	R extends Connect4Chips
> = Num extends S[1] ? ChangeArray<T, S[0], R> : T

type ChangeBoard<
	T extends Board,
	S extends [BoardRowNumber, BoardColumnNumber],
	R extends Connect4State
> = R extends Connect4Chips
	? [
			Change<T[0], S, 5, R>,
			Change<T[1], S, 4, R>,
			Change<T[2], S, 3, R>,
			Change<T[3], S, 2, R>,
			Change<T[4], S, 1, R>,
			Change<T[5], S, 0, R>
	  ]
	: never

type ChangeGameAt<
	T extends Game,
	S extends [BoardRowNumber, BoardColumnNumber]
> = ChangeBoard<T["board"], S, T["state"]> extends Board
	? {
			board: ChangeBoard<T["board"], S, T["state"]>
			state: T["state"]
	  }
	: never

type ChangePlayer<G extends Game> = G["state"] extends Connect4Chips
	? G["state"] extends "🔴"
		? {
				board: G["board"]
				state: "🟡"
		  }
		: {
				board: G["board"]
				state: "🔴"
		  }
	: G

type MakeMove<G extends Game, N extends BoardRowNumber> = ChangeGameAt<
	G,
	GetPosition<G["board"], N>
> extends never
	? G
	: ChangePlayer<ChangeGameAt<G, GetPosition<G["board"], N>>>

type FlattenArray<T extends unknown[][]> = T extends [
	infer A1 extends unknown[],
	...infer A2 extends unknown[][]
]
	? [...A1, ...FlattenArray<A2>]
	: Length<T> extends 1
	? [...T[0]]
	: []

type NoneExtends<T extends Connect4Cell[], S extends Connect4Cell> = T extends [
	infer A1 extends Connect4Cell,
	...infer A2 extends Connect4Cell[]
]
	? A1 extends S
		? false
		: NoneExtends<A2, S>
	: true

type AllSame<
	T extends MyArray<Connect4Cell, 4>,
	P extends Connect4Chips
> = T[0] extends P
	? T[1] extends P
		? T[2] extends P
			? T[3] extends P
				? true
				: false
			: false
		: false
	: false

type RowWin<T extends Row, P extends Connect4Chips> = AllSame<
	[T[0], T[1], T[2], T[3]],
	P
> extends true
	? true
	: AllSame<[T[1], T[2], T[3], T[4]], P> extends true
	? true
	: AllSame<[T[2], T[3], T[4], T[5]], P> extends true
	? true
	: AllSame<[T[3], T[4], T[5], T[6]], P> extends true
	? true
	: false

type HorizontalWin<T extends Row[], P extends Connect4Chips> = T extends [
	infer A1 extends Row,
	...infer A2 extends Row[]
]
	? RowWin<A1, P> extends true
		? true
		: HorizontalWin<A2, P>
	: false

type GetColumn<T extends Connect4Cell[][], Num extends BoardRowNumber> = [
	T[0][Num],
	T[1][Num],
	T[2][Num],
	T[3][Num],
	T[4][Num],
	T[5][Num],
	Connect4EmpytState
]

type Transpose<
	T extends Connect4Cell[][],
	Rows extends BoardRowNumber[] = [0, 1, 2, 3, 4, 5, 6]
> = Rows extends [
	infer A1 extends BoardRowNumber,
	...infer A2 extends BoardRowNumber[]
]
	? [GetColumn<T, A1>, ...Transpose<T, A2>]
	: []

type VerticalWin<T extends Board, P extends Connect4Chips> = HorizontalWin<
	Transpose<T>,
	P
>

type TransposeDiagonally1<T extends Board> = T extends [
	infer A1 extends Row,
	infer A2 extends Row,
	infer A3 extends Row,
	infer A4 extends Row,
	infer A5 extends Row,
	infer A6 extends Row
]
	? [
			[
				...A1,
				Connect4EmpytState,
				Connect4EmpytState,
				Connect4EmpytState,
				Connect4EmpytState,
				Connect4EmpytState
			],
			[
				Connect4EmpytState,
				...A2,
				Connect4EmpytState,
				Connect4EmpytState,
				Connect4EmpytState,
				Connect4EmpytState
			],
			[
				Connect4EmpytState,
				Connect4EmpytState,
				...A3,
				Connect4EmpytState,
				Connect4EmpytState,
				Connect4EmpytState
			],
			[
				Connect4EmpytState,
				Connect4EmpytState,
				Connect4EmpytState,
				...A4,
				Connect4EmpytState,
				Connect4EmpytState
			],
			[
				Connect4EmpytState,
				Connect4EmpytState,
				Connect4EmpytState,
				Connect4EmpytState,
				...A5,
				Connect4EmpytState
			],
			[
				Connect4EmpytState,
				Connect4EmpytState,
				Connect4EmpytState,
				Connect4EmpytState,
				Connect4EmpytState,
				...A6
			]
	  ]
	: never

type TransposeDiagonally2<T extends Board> = T extends [
	infer A1 extends Row,
	infer A2 extends Row,
	infer A3 extends Row,
	infer A4 extends Row,
	infer A5 extends Row,
	infer A6 extends Row
]
	? [
			[
				Connect4EmpytState,
				Connect4EmpytState,
				Connect4EmpytState,
				Connect4EmpytState,
				Connect4EmpytState,
				...A1
			],
			[
				Connect4EmpytState,
				Connect4EmpytState,
				Connect4EmpytState,
				Connect4EmpytState,
				...A2,
				Connect4EmpytState
			],
			[
				Connect4EmpytState,
				Connect4EmpytState,
				Connect4EmpytState,
				...A3,
				Connect4EmpytState,
				Connect4EmpytState
			],
			[
				Connect4EmpytState,
				Connect4EmpytState,
				...A4,
				Connect4EmpytState,
				Connect4EmpytState,
				Connect4EmpytState
			],
			[
				Connect4EmpytState,
				...A5,
				Connect4EmpytState,
				Connect4EmpytState,
				Connect4EmpytState,

				Connect4EmpytState
			],
			[
				...A6,
				Connect4EmpytState,
				Connect4EmpytState,
				Connect4EmpytState,
				Connect4EmpytState,
				Connect4EmpytState
			]
	  ]
	: never

type DiagonalWin1<T extends Board, P extends Connect4Chips> = HorizontalWin<
	Transpose<TransposeDiagonally1<T>>,
	P
>

type DiagonalWin2<T extends Board, P extends Connect4Chips> = HorizontalWin<
	Transpose<TransposeDiagonally2<T>>,
	P
>

type IsWinner<T extends Board, P extends Connect4Chips> = HorizontalWin<
	T,
	P
> extends true
	? true
	: VerticalWin<T, P> extends true
	? true
	: DiagonalWin1<T, P> extends true
	? true
	: DiagonalWin2<T, P> extends true
	? true
	: false

type IsDraw<T extends Board> = NoneExtends<FlattenArray<T>, Connect4EmpytState>

type BoardWinner<B extends Board> = IsWinner<B, "🔴"> extends true
	? "🔴"
	: IsWinner<B, "🟡"> extends true
	? "🟡"
	: IsDraw<B> extends true
	? 0
	: " "

type CheckWinState<G extends Game> = BoardWinner<G["board"]> extends "🔴"
	? {
			board: G["board"]
			state: "🔴 Won"
	  }
	: BoardWinner<G["board"]> extends "🟡"
	? {
			board: G["board"]
			state: "🟡 Won"
	  }
	: BoardWinner<G["board"]> extends 0
	? {
			board: G["board"]
			state: "Draw"
	  }
	: G

type Connect4<G extends Game, N extends BoardRowNumber> = CheckWinState<
	MakeMove<G, N>
>

type TicTacToeChip = "❌" | "⭕"
type TicTacToeEndState = "❌ Won" | "⭕ Won" | "Draw"
type TicTacToeState = TicTacToeChip | TicTacToeEndState
type TicTacToeEmptyCell = "  "
type TicTacToeCell = TicTacToeChip | TicTacToeEmptyCell
type TicTacToeYPositions = "top" | "middle" | "bottom"
type TicTacToeXPositions = "left" | "center" | "right"
type TicTacToePositions = `${TicTacToeYPositions}-${TicTacToeXPositions}`
type TicTacToeRow = [TicTacToeCell, TicTacToeCell, TicTacToeCell]
type TicTacToeBoard = [TicTacToeRow, TicTacToeRow, TicTacToeRow]
type TicTacToeGame = {
	board: TicTacToeBoard
	state: TicTacToeState
}

type EmptyBoard = [["  ", "  ", "  "], ["  ", "  ", "  "], ["  ", "  ", "  "]]

type NewGame = {
	board: EmptyBoard
	state: "❌"
}

type GetPositionX<S extends TicTacToeXPositions> = S extends "left"
	? 0
	: S extends "center"
	? 1
	: 2

type GetPositionY<S extends TicTacToeYPositions> = S extends "top"
	? 0
	: S extends "middle"
	? 1
	: 2

type GetPosition<S extends TicTacToePositions> =
	S extends `${infer Y}-${infer X}`
		? X extends TicTacToeXPositions
			? Y extends TicTacToeYPositions
				? [GetPositionY<Y>, GetPositionX<X>]
				: never
			: never
		: never

type PositionNumber = 0 | 1 | 2

type SaveChange<
	T extends TicTacToeCell,
	S extends TicTacToeChip
> = T extends TicTacToeEmptyCell ? S : never

type Change<
	T extends TicTacToeRow,
	S extends PositionNumber,
	R extends TicTacToeState
> = R extends TicTacToeChip
	? S extends 0
		? SaveChange<T[0], R> extends never
			? never
			: [SaveChange<T[0], R>, T[1], T[2]]
		: S extends 1
		? SaveChange<T[1], R> extends never
			? never
			: [T[0], SaveChange<T[1], R>, T[2]]
		: SaveChange<T[2], R> extends never
		? never
		: [T[0], T[1], SaveChange<T[2], R>]
	: never // "INVALID MOVE"

type ChangeBoard<
	T extends TicTacToeBoard,
	S extends [PositionNumber, PositionNumber],
	R extends TicTacToeState
> = S[0] extends 0
	? Change<T[0], S[1], R> extends never
		? never
		: [Change<T[0], S[1], R>, T[1], T[2]]
	: S[0] extends 1
	? Change<T[1], S[1], R> extends never
		? never
		: [T[0], Change<T[1], S[1], R>, T[2]]
	: Change<T[2], S[1], R> extends never
	? never
	: [T[0], T[1], Change<T[2], S[1], R>]

type ChangeGameAt<
	T extends TicTacToeGame,
	S extends [PositionNumber, PositionNumber]
> = ChangeBoard<T["board"], S, T["state"]> extends never
	? never
	: {
			board: ChangeBoard<T["board"], S, T["state"]>
			state: T["state"]
	  }

type ChangePlayer<T extends TicTacToeGame> = T["state"] extends TicTacToeChip
	? T["state"] extends "❌"
		? {
				board: T["board"]
				state: "⭕"
		  }
		: {
				board: T["board"]
				state: "❌"
		  }
	: T

type MakeMove<
	T extends TicTacToeGame,
	S extends TicTacToePositions
> = ChangeGameAt<T, GetPosition<S>> extends never
	? T
	: ChangePlayer<ChangeGameAt<T, GetPosition<S>>>

type AllSame<T extends TicTacToeRow, P extends TicTacToeChip> = T[0] extends P
	? T[1] extends P
		? T[2] extends P
			? true
			: false
		: false
	: false

type HorizontalWin<T extends TicTacToeBoard, P extends TicTacToeChip> = AllSame<
	T[0],
	P
> extends true
	? true
	: AllSame<T[1], P> extends true
	? true
	: AllSame<T[2], P> extends true
	? true
	: false

type Transpose<T extends TicTacToeBoard> = [
	[T[0][0], T[1][0], T[2][0]],
	[T[0][1], T[1][1], T[2][1]],
	[T[0][2], T[1][2], T[2][2]]
]

type VerticalWin<
	T extends TicTacToeBoard,
	P extends TicTacToeChip
> = HorizontalWin<Transpose<T>, P>

type Diagonal1<T extends TicTacToeBoard> = [T[0][0], T[1][1], T[2][2]]

type Diagonal2<T extends TicTacToeBoard> = Diagonal1<Transpose<T>>

type DiagonalWin<
	T extends TicTacToeBoard,
	P extends TicTacToeChip
> = HorizontalWin<[Diagonal1<T>, Diagonal2<T>, Diagonal2<T>], P>

type IsWinner<
	T extends TicTacToeBoard,
	P extends TicTacToeChip
> = HorizontalWin<T, P> extends true
	? true
	: VerticalWin<T, P> extends true
	? true
	: DiagonalWin<T, P> extends true
	? true
	: false

type DoesNotExtend<
	T extends TicTacToeRow,
	S extends TicTacToeCell
> = T[0] extends S
	? false
	: T[1] extends S
	? false
	: T[2] extends S
	? false
	: true

type IsDraw<T extends TicTacToeBoard> = DoesNotExtend<
	T[0],
	TicTacToeEmptyCell
> extends true
	? DoesNotExtend<T[1], TicTacToeEmptyCell> extends true
		? DoesNotExtend<T[2], TicTacToeEmptyCell> extends true
			? true
			: false
		: false
	: false

type BoardWinner<T extends TicTacToeBoard> = IsWinner<T, "❌"> extends true
	? "❌"
	: IsWinner<T, "⭕"> extends true
	? "⭕"
	: IsDraw<T> extends true
	? 0
	: " "

type CheckWinState<T extends TicTacToeGame> = BoardWinner<
	T["board"]
> extends "❌"
	? {
			board: T["board"]
			state: "❌ Won"
	  }
	: BoardWinner<T["board"]> extends "⭕"
	? {
			board: T["board"]
			state: "⭕ Won"
	  }
	: BoardWinner<T["board"]> extends 0
	? {
			board: T["board"]
			state: "Draw"
	  }
	: T

type TicTacToe<
	T extends TicTacToeGame,
	S extends TicTacToePositions
> = CheckWinState<MakeMove<T, S>>

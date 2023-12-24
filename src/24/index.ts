type Alley = "  "
type MazeItem = "🎄" | "🎅" | Alley
type DELICIOUS_COOKIES = "🍪"
type Directions = "up" | "down" | "left" | "right"

type MazeIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

type MazeIndexExtended = -1 | MazeIndex | 10

type Succ<T extends unknown[]> = [...T, ""]
type Succ2<S, T extends S[]> = [...T, S]

type Pred<T extends unknown[]> = T extends [infer A1, ...infer A2] ? A2 : []

type Construct<
	T extends MazeIndex,
	Z extends unknown[] = []
> = T extends Length<Z> ? Z : Construct<T, Succ<Z>>

type MyArray<T, AM extends number, Z extends T[] = []> = AM extends Length<Z>
	? Z
	: MyArray<T, AM, Succ2<T, Z>>

type MazeRow = MyArray<MazeItem, 10>
type Maze = MyArray<MazeRow, 10>

type GetAmount<T extends MazeItem[]> = T extends [
	infer A1 extends MazeItem,
	...infer A2 extends MazeItem[]
]
	? A1 extends "🎅"
		? []
		: Succ2<MazeItem, GetAmount<A2>>
	: never

type Length<T extends unknown[]> = T["length"]

type FindSanta1<T extends MazeItem[]> = GetAmount<T> extends unknown[]
	? Length<GetAmount<T>>
	: never

type FindSantaAll<
	T extends MazeItem[][],
	S extends MazeItem[] = []
> = T extends [infer A1 extends MazeItem[], ...infer A2 extends MazeItem[][]]
	? FindSanta1<A1> extends never
		? FindSantaAll<A2, Succ2<MazeItem, S>>
		: Length<S>
	: T extends [infer A1 extends MazeItem[]]
	? FindSanta1<A1>
	: never

type FindAll<S extends MazeItem[][], T extends number | never> = T extends never
	? never
	: [T, FindSanta1<S[T]>]

type FindSanta<T extends MazeItem[][]> = FindAll<T, FindSantaAll<T>>

type Minus1<T extends MazeIndex> = T extends 0 ? -1 : Length<Pred<Construct<T>>>

type Plus1<T extends MazeIndex> = Length<Succ<Construct<T>>>

type ActualMove<
	Pos extends [MazeIndex, MazeIndex],
	Dir extends Directions
> = Dir extends "up"
	? [Minus1<Pos[0]>, Pos[1]]
	: Dir extends "down"
	? [Plus1<Pos[0]>, Pos[1]]
	: Dir extends "left"
	? [Pos[0], Minus1<Pos[1]>]
	: Dir extends "right"
	? [Pos[0], Plus1<Pos[1]>]
	: never

type IsOutOfBounds<B extends MazeIndexExtended> = B extends -1
	? true
	: B extends 10
	? true
	: false

type ReplaceSingle<
	Ma extends MazeItem[],
	Pos extends MazeIndex,
	Elem extends MazeItem,
	CurrentIndex extends any[] = []
> = Ma extends [infer A1 extends MazeItem, ...infer A2 extends MazeItem[]]
	? Length<CurrentIndex> extends Pos
		? [Elem, ...A2]
		: [A1, ...ReplaceSingle<A2, Pos, Elem, Succ<CurrentIndex>>]
	: never

type ReplaceElement<
	Ma extends MazeItem[][],
	Pos extends [MazeIndex, MazeIndex],
	Elem extends MazeItem,
	CurrentIndex extends any[] = []
> = Ma extends [infer A1 extends MazeItem[], ...infer A2 extends MazeItem[][]]
	? Length<CurrentIndex> extends Pos[0]
		? [ReplaceSingle<A1, Pos[1], Elem>, ...A2]
		: [A1, ...ReplaceElement<A2, Pos, Elem, Succ<CurrentIndex>>]
	: Length<Ma> extends 1
	? Length<CurrentIndex> extends Pos[0]
		? [ReplaceSingle<Ma[0], Pos[1], Elem>]
		: [Ma[0]]
	: Length<Ma> extends 0
	? []
	: never

type Replace<
	Ma extends Maze,
	NewPos extends [MazeIndex, MazeIndex],
	Pos extends [MazeIndex, MazeIndex]
> = Ma[NewPos[0]][NewPos[1]] extends Alley
	? ReplaceElement<ReplaceElement<Ma, NewPos, "🎅">, Pos, Alley>
	: Ma // invalid move

type MakeMove<
	Ma extends Maze,
	NewPos extends [MazeIndexExtended, MazeIndexExtended],
	Pos extends [MazeIndex, MazeIndex]
> = IsOutOfBounds<NewPos[0]> extends true
	? "ExitedMaze"
	: IsOutOfBounds<NewPos[1]> extends true
	? "ExitedMaze"
	: NewPos extends [MazeIndex, MazeIndex]
	? Replace<Ma, NewPos, Pos>
	: never

type MovePos<
	Ma extends Maze,
	Pos extends [MazeIndex, MazeIndex],
	Dir extends Directions
> = ActualMove<Pos, Dir> extends [MazeIndexExtended, MazeIndexExtended]
	? MakeMove<Ma, ActualMove<Pos, Dir>, Pos> extends "ExitedMaze"
		? MyArray<MyArray<DELICIOUS_COOKIES, 10>, 10>
		: MakeMove<Ma, ActualMove<Pos, Dir>, Pos>
	: never

type Move<Maz extends Maze, Dir extends Directions> = MovePos<
	Maz,
	FindSanta<Maz>,
	Dir
>

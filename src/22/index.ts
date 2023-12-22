/** because "dashing" implies speed */
type Dasher = "💨"

/** representing dancing or grace */
type Dancer = "💃"

/** a deer, prancing */
type Prancer = "🦌"

/** a star for the dazzling, slightly mischievous Vixen */
type Vixen = "🌟"

/** for the celestial body that shares its name */
type Comet = "☄️"

/** symbolizing love, as Cupid is the god of love */
type Cupid = "❤️"

/** representing thunder, as "Donner" means thunder in German */
type Donner = "🌩️"

/** meaning lightning in German, hence the lightning bolt */
type Blitzen = "⚡"

/** for his famous red nose */
type Rudolph = "🔴"

type Reindeer =
	| Dasher
	| Dancer
	| Prancer
	| Vixen
	| Comet
	| Cupid
	| Donner
	| Blitzen
	| Rudolph

type Length<T extends any[]> = T["length"]

type Succ<S, T extends S[]> = [...T, S]
type MyArray<T, AM extends number, Z extends T[] = []> = AM extends Length<Z>
	? Z
	: MyArray<T, AM, Succ<T, Z>>

type Row = MyArray<MyArray<Reindeer, 3>, 3>

type Board = MyArray<Row, 9>

type IsNotTwiceIn<
	T extends Reindeer,
	S extends Reindeer[],
	Cnt extends number = 0
> = S extends [infer A1, ...infer A2 extends Reindeer[]]
	? A1 extends T
		? Cnt extends 1
			? false
			: IsNotTwiceIn<T, A2, 1>
		: IsNotTwiceIn<T, A2, Cnt>
	: Length<S> extends 1
	? S extends T
		? Cnt extends 1
			? false
			: true
		: true
	: true //length is 0

type IsValidFor<
	T extends MyArray<Reindeer, 9>,
	Left extends Reindeer[] = T
> = Left extends [infer A1, ...infer A2]
	? A1 extends Reindeer
		? A2 extends Reindeer[]
			? IsNotTwiceIn<A1, T> extends true
				? IsValidFor<T, A2>
				: false
			: "TYPE ERROR in IsValidFor 2"
		: "TYPE ERROR in IsValidFor 1"
	: Length<Left> extends 1
	? IsNotTwiceIn<Left[0], T> extends true
		? true
		: false
	: true // length is 0

type IsValidForAll<T extends MyArray<Reindeer, 9>[]> = T extends [
	infer A1,
	...infer A2
]
	? A1 extends MyArray<Reindeer, 9>
		? A2 extends MyArray<Reindeer, 9>[]
			? IsValidFor<A1> extends true
				? IsValidForAll<A2>
				: false
			: "ERROR: internal type error 2"
		: "ERROR: internal type error 1"
	: Length<T> extends 1
	? IsValidFor<T[0]>
	: true //length is 0

type ValidateResult<T extends unknown[][]> = T extends MyArray<Reindeer, 9>[]
	? T //
	: never // "Type error: Too few element in a row in ValidateResult";

type Mod3Number = 0 | 1 | 2

type RowCalc<S extends Mod3Number, T extends Mod3Number> = S extends 0
	? T
	: S extends 1
	? T extends 0
		? 3
		: T extends 1
		? 4
		: T extends 2
		? 5
		: never // ERROR
	: S extends 2
	? T extends 0
		? 6
		: T extends 1
		? 7
		: T extends 2
		? 8
		: never // ERROR
	: never

type GetRegion<T extends Board, Num extends [Mod3Number, Mod3Number]> = [
	...T[RowCalc<Num[0], 0>][Num[1]],
	...T[RowCalc<Num[0], 1>][Num[1]],
	...T[RowCalc<Num[0], 2>][Num[1]]
]

type Combine<
	First extends Mod3Number[],
	Second extends [Mod3Number, Mod3Number, Mod3Number]
> = Length<First> extends 0
	? []
	: Length<First> extends 1
	? [[First[0], Second[0]], [First[0], Second[1]], [First[0], Second[2]]]
	: First extends [
			infer F1 extends Mod3Number,
			...infer F2 extends Mod3Number[]
	  ]
	? [...Combine<[F1], Second>, ...Combine<F2, Second>]
	: never

type Module3Table = Combine<[0, 1, 2], [0, 1, 2]>

type Modulo3<T extends number> = Module3Table[T]

type GetAllRegionsHelper<B extends Board, T extends Row[]> = Length<T> extends 0
	? []
	: Length<T> extends 1
	? [GetRegion<B, Modulo3<0>>]
	: T extends [infer A1, ...infer A2]
	? A1 extends Row
		? A2 extends Row[]
			? [GetRegion<B, Modulo3<Length<A2>>>, ...GetAllRegionsHelper<B, A2>]
			: ["Type error 3 in: GetAllRegionsHelper"]
		: ["Type error 2 in: GetAllRegionsHelper"]
	: ["Type error 1 in: GetAllRegionsHelper"]

type GetAllRegions<T extends Board> = ValidateResult<GetAllRegionsHelper<T, T>>

type GetRow<T extends Row> = [...T[0], ...T[1], ...T[2]]

type GetAllRowsHelper<T extends Row[]> = Length<T> extends 0
	? []
	: Length<T> extends 1
	? [GetRow<T[0]>]
	: T extends [infer A1, ...infer A2]
	? A1 extends Row
		? A2 extends Row[]
			? [GetRow<A1>, ...GetAllRowsHelper<A2>]
			: ["Type error 3 in: GetAllRowsHelper"]
		: ["Type error 2 in: GetAllRowsHelper"]
	: ["Type error 1 in: GetAllRowsHelper"]

type GetAllRows<T extends Board> = ValidateResult<GetAllRowsHelper<T>>

type GetColumn<
	T extends Board,
	Num extends number,
	R extends Reindeer[][] = GetAllRows<T>
> = Length<R> extends 0
	? [] // end of recursion
	: Length<R> extends 1
	? [
			Num extends keyof R[0] ? R[0][Num] : never, // ERROR:
			...GetColumn<T, Num, []>
	  ]
	: R extends [infer A1, ...infer A2 extends Reindeer[][]]
	? [
			Num extends keyof R[0] ? R[0][Num] : never, // ERROR:
			...GetColumn<T, Num, A2>
	  ]
	: never // ERROR

type GetAllColumnsHelper<B extends Board, T extends Row[]> = Length<T> extends 0
	? []
	: Length<T> extends 1
	? [GetColumn<B, 0>]
	: T extends [infer A1 extends Row, ...infer A2 extends Row[]]
	? [GetColumn<B, Length<A2>>, ...GetAllColumnsHelper<B, A2>]
	: ["Type error in: GetAllColumnsHelper"]

type GetAllColumns<T extends Board> = ValidateResult<GetAllColumnsHelper<T, T>>

type AllRegionsValid<T extends Board> = IsValidForAll<GetAllRegions<T>>

type AllRowsValid<T extends Board> = IsValidForAll<GetAllRows<T>>

type AllColumnsValid<T extends Board> = IsValidForAll<GetAllColumns<T>>

type Validate<T extends Board> = AllRegionsValid<T> extends true
	? AllRowsValid<T> extends true
		? AllColumnsValid<T> extends true
			? true
			: false
		: false
	: false

type Length<T extends any[]> = T["length"]

type Succ<T extends unknown[]> = [...T, ""]

type Pred<T extends unknown[]> = T extends [infer A1, ...infer A2] ? A2 : []

type Construct<T extends number, Z extends unknown[] = []> = T extends Length<Z>
	? Z
	: Succ<Z>

type Sequence<T extends any[], S extends number> = Length<T> extends S
	? Length<T>
	: Length<T> | Sequence<Succ<T>, S>

type DayCounter<Start extends number, End extends number> = Sequence<
	Construct<Start>,
	End
>

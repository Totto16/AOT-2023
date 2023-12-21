type Succ<T extends unknown[]> = [...T, ""]

type GetAmount<T extends any[]> = T extends [infer A1, ...infer A2]
	? A1 extends "🎅🏼"
		? []
		: Succ<GetAmount<A2>>
	: never

type Length<T extends any[]> = T["length"]

type FindSanta1<T extends any[]> = GetAmount<T> extends unknown[]
	? Length<GetAmount<T>>
	: never

type FindSantaAll<T extends any[][], S extends any[] = []> = T extends [
	infer A1,
	...infer A2
]
	? A1 extends any[]
		? A2 extends any[][]
			? FindSanta1<A1> extends never
				? FindSantaAll<A2, Succ<S>>
				: Length<S>
			: never
		: never
	: T extends [infer A1]
	? A1 extends any[]
		? FindSanta1<A1>
		: never
	: never

type FindAll<S extends any[][], T extends number | never> = T extends never
	? never
	: [T, FindSanta1<S[T]>]

type FindSanta<T extends any[][]> = FindAll<T, FindSantaAll<T>>

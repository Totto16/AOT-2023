type Succ<T extends unknown[]> = [...T, ""]

type GetAmount<T extends any[]> = T extends [infer A1, ...infer A2]
	? A1 extends "🎅🏼"
		? []
		: Succ<GetAmount<A2>>
	: never

type Length<T extends any[]> = T["length"]

type FindSanta<T extends any[]> = GetAmount<T> extends unknown[]
	? Length<GetAmount<T>>
	: never

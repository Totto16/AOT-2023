type Succ<T extends unknown[]> = [...T, ""]

type GetAmount<T extends any[], S> = T extends [infer A1, ...infer A2]
	? A1 extends S
		? Succ<GetAmount<A2, S>>
		: GetAmount<A2, S>
	: T extends [infer A1]
	? A1 extends S
		? [""]
		: []
	: []

type Length<T extends any[]> = T["length"]

type Count<T extends any[], S> = Length<GetAmount<T, S>>

type Length<T extends unknown[]> = T["length"]
type Succ<T extends unknown[]> = [...T, ""]

type GenerateSingle<
	T extends number,
	S,
	Count extends any[] = []
> = Length<Count> extends T ? [] : [S, ...GenerateSingle<T, S, Succ<Count>>]

type Generate<
	T extends number[],
	S extends any[],
	P extends any[] = []
> = T extends [infer A1 extends number, ...infer A2 extends number[]]
	? S[Length<P>] extends undefined
		? [...GenerateSingle<A1, S[0]>, ...Generate<A2, S, Succ<[]>>]
		: [...GenerateSingle<A1, S[Length<P>]>, ...Generate<A2, S, Succ<P>>]
	: []

type Rebuild<T extends number[]> = Generate<T, ["🛹", "🚲", "🛴", "🏄"]>

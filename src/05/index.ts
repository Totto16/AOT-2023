type ArrayElement<ArrayType extends readonly unknown[]> =
	ArrayType extends readonly [infer ElementType1, ...infer ElementType2]
		? [ElementType1, ArrayElement<ElementType2>]
		: []

type FlattenArray<T extends readonly unknown[]> = T extends readonly [
	infer E1,
	[infer E2, infer E3]
]
	? E3 extends unknown[]
		? readonly [E1, E2, ...FlattenArray<E3>]
		: E3 extends never
		? []
		: [E1, E2]
	: T extends readonly [infer E1, []]
	? readonly [E1]
	: []

type SantasList<B extends readonly unknown[], G extends readonly unknown[]> = [
	...FlattenArray<ArrayElement<B>>,
	...FlattenArray<ArrayElement<G>>
]

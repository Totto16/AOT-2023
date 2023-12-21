type ReadOnlySelf<T> = T extends Record<any, unknown>
	? {
			readonly [key in keyof T]: ReadOnlySelf<T[key]>
	  }
	: T extends unknown[]
	? T extends [infer A1, ...infer A2]
		? readonly [ReadOnlySelf<A1>, ...ReadOnlySelf<A2>]
		: T extends [infer Z]
		? readonly [ReadOnlySelf<Z>]
		: T
	: T

type SantaListProtector<T> = ReadOnlySelf<T>

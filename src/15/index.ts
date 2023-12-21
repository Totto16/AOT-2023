type Length<T extends unknown[]> = T["length"]

type U = Exclude<3 | 4, 4>

type ArrayFor<
	El,
	U extends number,
	T extends unknown[] = []
> = U extends Length<T> ? T : ArrayFor<El, U, [El, ...T]>

type BoxToys<T extends string, U extends number> = ArrayFor<T, U>

type AppendGood<T> = {
	[K in keyof T as K extends string ? `good_${K}` : never]: T[K]
}

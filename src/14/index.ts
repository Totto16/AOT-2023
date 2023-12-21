type SplitString<
	T extends string,
	S extends string
> = T extends `${infer R1}${S}${infer R2}` ? R1 | SplitString<R2, S> : T

type DecipherNaughtyList<T extends string> = SplitString<T, "/">

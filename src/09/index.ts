type Reverse<T extends string> = T extends `${infer F}${infer R}`
	? `${Reverse<R>}${F}`
	: T

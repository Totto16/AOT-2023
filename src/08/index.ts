type RemoveNaughtyChildren<T> = {
	[K in keyof T as K extends `naughty_${infer Z}` ? never : K]: T[K]
}

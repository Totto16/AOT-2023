type Letters = {
	A: ["█▀█ ", "█▀█ ", "▀ ▀ "]
	B: ["█▀▄ ", "█▀▄ ", "▀▀  "]
	C: ["█▀▀ ", "█ ░░", "▀▀▀ "]
	E: ["█▀▀ ", "█▀▀ ", "▀▀▀ "]
	H: ["█ █ ", "█▀█ ", "▀ ▀ "]
	I: ["█ ", "█ ", "▀ "]
	M: ["█▄░▄█ ", "█ ▀ █ ", "▀ ░░▀ "]
	N: ["█▄░█ ", "█ ▀█ ", "▀ ░▀ "]
	P: ["█▀█ ", "█▀▀ ", "▀ ░░"]
	R: ["█▀█ ", "██▀ ", "▀ ▀ "]
	S: ["█▀▀ ", "▀▀█ ", "▀▀▀ "]
	T: ["▀█▀ ", "░█ ░", "░▀ ░"]
	Y: ["█ █ ", "▀█▀ ", "░▀ ░"]
	W: ["█ ░░█ ", "█▄▀▄█ ", "▀ ░ ▀ "]
	" ": ["░", "░", "░"]
	":": ["#", "░", "#"]
	"*": ["░", "#", "░"]
}

type SplitByNewline<T extends string> = T extends `${infer R1}\n${infer R2}`
	? [R1, ...SplitByNewline<R2>]
	: [T]

type ApplyChar<
	T extends string,
	A extends number
> = T extends `${infer R1}${infer R2}`
	? R1 extends keyof Letters
		? R2 extends string
			? `${Letters[R1][A]}${ApplyChar<R2, A>}`
			: never
		: never
	: T extends `${infer R1}`
	? R1 extends keyof Letters
		? Letters[R1][A]
		: ""
	: ""

type Apply<T extends string> = [
	ApplyChar<T, 0>,
	ApplyChar<T, 1>,
	ApplyChar<T, 2>
]

type ForEachApply<T extends string[]> = T extends [infer A1, ...infer A2]
	? A1 extends string
		? A2 extends string[]
			? [...Apply<Uppercase<A1>>, ...ForEachApply<A2>]
			: []
		: []
	: T extends [infer A1]
	? A1 extends string
		? [...Apply<Uppercase<A1>>]
		: []
	: []

type ToAsciiArt<T extends string> = ForEachApply<SplitByNewline<T>>

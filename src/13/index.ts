type Length<T extends any[]> = T["length"]

type Succ<T extends unknown[]> = [...T, ""]

type Pred<T extends unknown[]> = T extends [infer A1, ...infer A2] ? A2 : []

type Construct<T extends number, Z extends unknown[] = []> = T extends Length<Z>
	? Z
	: Construct<T, Succ<Z>>

type Sequence<T extends any[], S extends number> = Length<T> extends S
	? Length<T>
	: Length<T> | Sequence<Succ<T>, S>

// Type instantiation is excessively deep and possibly infinite
//type DayCounterOld<Start extends number, End extends number> = Sequence<Construct<Start>, End>;
type DayCounterSpecial<Start extends any[], End extends number> = Sequence<
	Start,
	End
>

type DayCounter<Start extends number, End extends number> = Start extends 1
	? Sequence<Succ<[]>, End>
	: "ERROR: not starting with 1"

// my own test:
import { Expect, Equal } from "type-testing"

type StartAt5 = 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
type test_5_begin_actual = DayCounterSpecial<Construct<5>, 12>
//   ^?
type test_5_begin_expected = StartAt5
type test_5_begin_ = Expect<Equal<test_5_begin_expected, test_5_begin_actual>>

type LastOfSplitString<T extends string,S extends string> = T extends `${infer R1}${S}${infer R2}` ? LastOfSplitString<R2,S> : T

type StreetSuffixTester<T extends string, K extends string> = LastOfSplitString<T, ' '> extends K ? true : false

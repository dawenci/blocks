type OneOf<T extends readonly string[]> = T[number]

type MaybeOneOf<A extends readonly any[]> = A[number] | null

type ConcatStr<S1 extends string, S2 extends string> = `${S1}${S2}`

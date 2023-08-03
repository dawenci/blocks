export interface ChunkIterateOptions<T> {
    chunkSize?: number;
    schedule?: (task: () => void) => void;
    complete?: () => void;
    iterator?: Iterator<T>;
}
export declare function chunkIterate<T>(data: T[], fn: (item: T, index: number) => void, options: ChunkIterateOptions<T>): void;

export function chunkIterate(data, fn, options) {
    let index = 0;
    const iterator = options.iterator || {
        next: () => {
            return { value: data[index], done: index === data.length };
        },
    };
    const chunkSize = options.chunkSize || 10000;
    const batch = () => {
        while (true) {
            const { value, done } = iterator.next();
            if (done) {
                if (options.complete)
                    options.complete();
                break;
            }
            fn(value, index);
            index += 1;
            if (index % chunkSize === 0 && options.schedule) {
                options.schedule(batch);
                break;
            }
        }
    };
    batch();
}

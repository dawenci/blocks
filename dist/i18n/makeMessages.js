export function makeMessages(moduleName, defaultMessages = {}) {
    return (key) => {
        const messages = window.BlocksUI?.messages?.[moduleName] ?? defaultMessages;
        return messages[key] ?? '';
    };
}

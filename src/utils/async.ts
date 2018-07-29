export const wait = (delay: number = 0): Promise<void> => {
    return new Promise(res => setTimeout(res, delay));
}
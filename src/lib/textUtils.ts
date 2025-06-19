export const constrainedText = (string: string, max_length: number): string => {
    const words = string.split(' ');
    for (let x = 0; x < words.length; x++) {
        if (words[0].length > max_length) {
            return string.slice(0, max_length) + '...';
        }
        if (words.slice(0, x).join(' ').length > max_length) {
            return words.slice(0, x - 1).join(' ') + '...';
        }
    }
    return string;
};

export const constrain = (val: number, min_val: number, max_val: number) => {
    return Math.min(max_val, Math.max(min_val, val));
};

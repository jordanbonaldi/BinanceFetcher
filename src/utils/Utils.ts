export function intervalToNum(interval: string): number {
        let charInterval = interval[interval.length - 1];

        let formula =
            charInterval === 'm' ? 60 :
            charInterval === 'h' ? 60 * 60 :
            charInterval === 'd' ? 60 * 60 * 25:
            60 * 60 * 24 * 2;

        return parseInt(interval) * formula;
};
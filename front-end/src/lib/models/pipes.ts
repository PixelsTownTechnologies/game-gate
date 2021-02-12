export type PipeFunction<T> = (value: T, subInput: any) => T;

export const formattedNumber = (value: number) => {
    return parseFloat(( value * 100 / 100 ).toFixed(2));
}

export const CostPipe: PipeFunction<string> = (value: string | undefined): string => {
    if (!value || isNaN(Number(value))) {
        return '0.0';
    }
    return formattedNumber(Number(value)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const RangePipe: PipeFunction<number> = (value: number | undefined, {max, min}: { max: number, min: number }): number => {
    return value && !isNaN(value) ? (value > max ? max : value < min ? min : value) : min;
}

export const NumberPipe: PipeFunction<number> = (value: number | undefined): number => {
    return value && !isNaN(value) ? Number(value) : '' as any;
}

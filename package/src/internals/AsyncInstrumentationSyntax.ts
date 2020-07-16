import { AsyncInstrumentationLike, InstrumentationParametersOf, InstrumentationResultOf } from '~/types';

type InstrumentationReadyCallback<R> = (result: R, error?: any | undefined) => void;

interface AsyncInstrumentationSyntax<I extends AsyncInstrumentationLike<I>, R extends object = {}> {
    with<K extends Exclude<keyof I, symbol>>(instrumentation: K, ...parameters: InstrumentationParametersOf<I, K>): AsyncInstrumentationSyntax<I, R & Record<K, InstrumentationResultOf<I, K>>>;
    ready(onReady: InstrumentationReadyCallback<R>): void;
    ready(): Promise<R>;
}

export {
    AsyncInstrumentationSyntax,
    InstrumentationReadyCallback,
};

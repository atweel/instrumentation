import { InstrumentationLike, InstrumentationParametersOf, InstrumentationResultOf } from '~/types';

interface InstrumentationSyntax<I extends InstrumentationLike<I>, R extends object = {}> {
    with<K extends Exclude<keyof I, symbol>>(instrumentation: K, ...parameters: InstrumentationParametersOf<I, K>): InstrumentationSyntax<I, R & Record<K, InstrumentationResultOf<I, K>>>;
    complete(): R;
}

export {
    InstrumentationSyntax,
};

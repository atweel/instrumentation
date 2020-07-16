import { InstrumentationHook } from '~/types';
import { InstrumentationLike, SyncInstrumentationHook } from '~/types';

type Instrumentable<I extends InstrumentationLike<I>, O extends object = object> = {
    [InstrumentationHook]: SyncInstrumentationHook<I, O>;
}

export {
    Instrumentable,
};

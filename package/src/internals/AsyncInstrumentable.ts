import { InstrumentationHook } from '~/types';
import { AsyncInstrumentationLike, AsyncInstrumentationHook } from '~/types';

type AsyncInstrumentable<I extends AsyncInstrumentationLike<I>, O extends object = object> = {
    [InstrumentationHook]: AsyncInstrumentationHook<I, O>;
}

export {
    AsyncInstrumentable,
};

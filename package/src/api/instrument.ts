import { Annotations, Callable, CallableExecutionMode } from '@atweel/primitives';

import { 
    InstrumentationLike, 
    AsyncInstrumentationLike, 
    InstrumentationConstructor, 
    AsyncInstrumentationConstructor, 
    InstrumentationHook,
} from '~/types';

import { Instrumentable } from '~/internals/Instrumentable';
import { InstrumentationSyntax } from '~/internals/InstrumentationSyntax';
import { InstrumentationFlow } from '~/internals/InstrumentationFlow';
import { AsyncInstrumentable } from '~/internals/AsyncInstrumentable';
import { AsyncInstrumentationSyntax } from '~/internals/AsyncInstrumentationSyntax';
import { AsyncInstrumentationFlow } from '~/internals/AsyncInstrumentationFlow';

function isInstrumentable(instance: any): instance is Instrumentable<any> {
    return instance?.[InstrumentationHook]?.[Annotations]?.[Callable.ExecutionMode] === CallableExecutionMode.Synchronous;
}

function isAsyncInstrumentable(instance: any): instance is Instrumentable<any> {
    return instance?.[InstrumentationHook]?.[Annotations]?.[Callable.ExecutionMode] === CallableExecutionMode.Asynchronous;
}

function instrument<I extends InstrumentationLike<I>> (target: Instrumentable<I>, instrumentationConstructor: InstrumentationConstructor<I>): InstrumentationSyntax<I>;
function instrument<I extends AsyncInstrumentationLike<I>> (target: AsyncInstrumentable<I>, instrumentationConstructor: AsyncInstrumentationConstructor<I>): AsyncInstrumentationSyntax<I>;
function instrument(target: Instrumentable<any> | AsyncInstrumentable<any>, instrumentationConstructor: any): any {
    if (isInstrumentable(target)) {
        return new InstrumentationFlow<any>(target, new instrumentationConstructor());
    } else {
        if (isAsyncInstrumentable(target)) {
            return new AsyncInstrumentationFlow<any>(target, new instrumentationConstructor());
        } else {
            throw new Error(`The target is neither Instrumentable nor AsyncInstrumentable.`);
        }
    }
}

export default instrument;

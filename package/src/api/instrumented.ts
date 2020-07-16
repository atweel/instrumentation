import { Annotations, Callable, CallableExecutionMode } from '@atweel/primitives';

import { Instrumentable } from '~/internals/Instrumentable';
import { InstrumentationSyntax } from '~/internals/InstrumentationSyntax';
import { InstrumentationFlow } from '~/internals/InstrumentationFlow';
import { InstrumentationLike, AsyncInstrumentationLike, InstrumentationFactory, AsyncInstrumentationFactory } from '~/types';
import { AsyncInstrumentable } from '~/internals/AsyncInstrumentable';
import { AsyncInstrumentationSyntax } from '~/internals/AsyncInstrumentationSyntax';
import { InstrumentationHook } from '~/types';
import { AsyncInstrumentationFlow } from '~/internals/AsyncInstrumentationFlow';

function isInstrumentable(instance: any): instance is Instrumentable<any> {
    return instance?.[InstrumentationHook]?.[Annotations]?.[Callable.ExecutionMode] === CallableExecutionMode.Synchronous;
}

function isAsyncInstrumentable(instance: any): instance is Instrumentable<any> {
    return instance?.[InstrumentationHook]?.[Annotations]?.[Callable.ExecutionMode] === CallableExecutionMode.Asynchronous;
}

function instrumented<I extends InstrumentationLike<I>> (target: Instrumentable<I>, instrumentationFactory: InstrumentationFactory<I>): InstrumentationSyntax<I>;
function instrumented<I extends AsyncInstrumentationLike<I>> (target: AsyncInstrumentable<I>, instrumentationFactory: AsyncInstrumentationFactory<I>): AsyncInstrumentationSyntax<I>;
function instrumented(target: Instrumentable<any> | AsyncInstrumentable<any>, instrumentationFactory: any): any {
    if (isInstrumentable(target)) {
        return new InstrumentationFlow<any>(target, instrumentationFactory());
    } else {
        if (isAsyncInstrumentable(target)) {
            return new AsyncInstrumentationFlow<any>(target, instrumentationFactory());
        } else {
            throw new Error(`The target is neither Instrumentable nor AsyncInstrumentable.`);
        }
    }
}

export default instrumented;

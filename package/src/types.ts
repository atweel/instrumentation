/* eslint-disable no-inner-declarations */
import { Constructor, Marked, Callable, mark, annotate, CallableExecutionMode } from '@atweel/primitives';

import { Instrumentable } from '~/internals/Instrumentable';
import { AsyncInstrumentable } from '~/internals/AsyncInstrumentable';

export type InstrumentationFunction<O extends object = object, P extends any[] = any[], C = any> = (configuration: C, ...parameters: P) => Promise<O> | O;

export type InstrumentationLike<I, O extends object = object, P extends any[] = any[], C = null> = {
    [K in keyof I]: I[K] extends (context: C, ...parameters: P) => O ? I[K] : never;
}
export interface InstrumentationDictionary {
    [key: string]: InstrumentationFunction | undefined;
}
export type AsyncInstrumentationLike<I, O extends object = object, P extends any[] = any[], C = null> = {
    [K in keyof I]: I[K] extends ((context: C, ...parameters: P) => Promise<O> | O) ? I[K] : never;
};

export type InstrumentationHookHandler<I extends InstrumentationLike<I>> = (instrumentation: I, configuration: InstrumentationConfiguration<I>) => object;
export type InstrumentationHookAsyncHandler<I extends AsyncInstrumentationLike<I>> = (instrumentation: I, configuration: InstrumentationConfiguration<I>) => Promise<object>;
export type InstrumentationConfiguration<I extends InstrumentationLike<I, any> | AsyncInstrumentationLike<I, any>> = Partial<Record<keyof I, any[]>>;
export type InstrumentationOf<T> = T extends Instrumentable<infer I> | AsyncInstrumentable<infer I> ? I : never;
export type InstrumentationConstructor<I> = Constructor<InstrumentationLike<I>>;
export type InstrumentationFactory<I> = () => InstrumentationLike<I>;
export type AsyncInstrumentationConstructor<I> = Constructor<AsyncInstrumentationLike<I>>;
export type AsyncInstrumentationFactory<I> = () => AsyncInstrumentationLike<I>;

export type InstrumentationParametersOf<I extends InstrumentationLike<I> | AsyncInstrumentationLike<I>, K extends keyof I> = 
    I[K] extends (configuration: any, ...parameters: infer P) => any ? P : never;

export type InstrumentationResultOf<I extends InstrumentationLike<I> | AsyncInstrumentationLike<I>, K extends keyof I> = 
    I[K] extends (...parameters: any[]) => Promise<infer R> 
        ? R
        : I[K] extends (...parameters: any[]) => infer R
            ? R
            : never;

export type SyncInstrumentationHook<I extends InstrumentationLike<I> = any, R extends object = object> = 
    Marked<'SyncInstrumentationHook'> & Callable<R, [I, InstrumentationConfiguration<I>]>;

export namespace SyncInstrumentationHook {
    export function from<I extends InstrumentationLike<I>>(handler: InstrumentationHookHandler<I>): SyncInstrumentationHook {
        return mark(annotate(handler, {
            [Callable.ExecutionMode]: CallableExecutionMode.Synchronous,
        }), 'SyncInstrumentationHook');
    }
}

export type AsyncInstrumentationHook<I extends AsyncInstrumentationLike<I> = any, R extends object = object> =
    Marked<'AsyncInstrumentationHook'> & Callable<Promise<R>, [I, InstrumentationConfiguration<I>]>;

export namespace AsyncInstrumentationHook {
    export function from<I extends AsyncInstrumentationLike<I>>(handler: InstrumentationHookAsyncHandler<I>): AsyncInstrumentationHook<I> {
        return mark(annotate(handler, {
            [Callable.ExecutionMode]: CallableExecutionMode.Asynchronous,
        }), 'AsyncInstrumentationHook');
    }
}

export type InstrumentationHook = SyncInstrumentationHook | AsyncInstrumentationHook;

export const InstrumentationHook = Symbol();

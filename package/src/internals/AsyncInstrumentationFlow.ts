import { AsyncInstrumentationLike } from '~/types';
import { AsyncInstrumentable } from './AsyncInstrumentable';
import { AsyncInstrumentationBuilder } from './AsyncInstrumentationBuilder';
import { AsyncInstrumentationSyntax, InstrumentationReadyCallback } from './AsyncInstrumentationSyntax';

class AsyncInstrumentationFlow<I extends AsyncInstrumentationLike<I>> implements AsyncInstrumentationSyntax<I, any> {
    public constructor(target: AsyncInstrumentable<I>, instrumentation: AsyncInstrumentationLike<I>) {
        this.builder = new AsyncInstrumentationBuilder(target, instrumentation);
    }

    public with(instrumentation: Exclude<keyof AsyncInstrumentable<I>, symbol>, ...parameters: any[]): AsyncInstrumentationFlow<I> {
        this.builder.addInstrument(instrumentation, parameters);

        return this;
    }
    
    public ready(onReady?: InstrumentationReadyCallback<any>): void;
    public ready(): Promise<any>;
    public ready(onReady?: InstrumentationReadyCallback<any>): void | Promise<any> {
        const promise = this.builder.build();

        if (onReady) {
            promise
                .then((result) => onReady(result))
                .catch((error) => onReady(null, error));
        } else {
            return promise;
        }
    }

    private readonly builder: AsyncInstrumentationBuilder<I>;
}

export {
    AsyncInstrumentationFlow,
};

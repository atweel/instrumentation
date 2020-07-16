import { InstrumentationConfiguration, AsyncInstrumentationLike, InstrumentationHook } from '~/types';
import { AsyncInstrumentable } from './AsyncInstrumentable';

class AsyncInstrumentationBuilder<I extends AsyncInstrumentationLike<I>> {
    public constructor(
        private readonly target: AsyncInstrumentable<I>, 
        private readonly instrumentation: AsyncInstrumentationLike<I>
    ) {

    }

    public addInstrument(name: Exclude<keyof I, symbol>, parameters: any[]): void  {
        if (this.configuration[name]) {
            throw new Error(`Instrument '${ name }' already configured.`);
        }

        this.configuration[name] = parameters;
    }

    public build(): Promise<object> {
        return this.target[InstrumentationHook](this.instrumentation, this.configuration);
    }

    private readonly configuration: InstrumentationConfiguration<I> = {};
}

export {
    AsyncInstrumentationBuilder,
};

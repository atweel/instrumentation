import { InstrumentationConfiguration, InstrumentationLike } from '~/types';
import { Instrumentable } from './Instrumentable';
import { InstrumentationHook } from '~/types';

class InstrumentationBuilder<I extends InstrumentationLike<I>> {
    public constructor(
        private readonly target: Instrumentable<I>, 
        private readonly instrumentation: InstrumentationLike<I>
    ) {

    }

    public addInstrument(name: Exclude<keyof I, symbol>, parameters: any[]): void  {
        if (this.configuration[name]) {
            throw new Error(`Instrument '${ name }' already configured.`);
        }

        this.configuration[name] = parameters;
    }

    public build(): object {
        return this.target[InstrumentationHook](this.instrumentation, this.configuration);
    }

    private readonly configuration: InstrumentationConfiguration<I> = {};
}

export {
    InstrumentationBuilder,
};

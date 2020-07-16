import { InstrumentationSyntax } from '~/internals/InstrumentationSyntax';
import { InstrumentationBuilder } from '~/internals/InstrumentationBuilder';
import { Instrumentable } from '~/internals/Instrumentable';
import { InstrumentationLike } from '~/types';

class InstrumentationFlow<I extends InstrumentationLike<I>> implements InstrumentationSyntax<object, any> {
    public constructor(target: Instrumentable<I>, instrumentation: InstrumentationLike<I>) {
        this.builder = new InstrumentationBuilder(target, instrumentation);
    }

    public with(instrumentation: Exclude<keyof Instrumentable<I>, symbol>, ...parameters: any[]): InstrumentationFlow<I> {
        this.builder.addInstrument(instrumentation, parameters);

        return this;
    }
    
    public complete(): any {
        return this.builder.build();
    }

    private readonly builder: InstrumentationBuilder<I>;
}

export {
    InstrumentationFlow,
};

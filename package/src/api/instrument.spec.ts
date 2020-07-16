/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import 'jest';

import { mapValues } from 'lodash';

import { 
    InstrumentationConfiguration, 
    SyncInstrumentationHook, 
    AsyncInstrumentationHook, 
    InstrumentationHook, 
} from '~/types';

import { Instrumentable } from '~/internals/Instrumentable';
import { AsyncInstrumentable } from '~/internals/AsyncInstrumentable';

import instrument from './instrument';

class SampleInstrumentation {
    
}

class SampleInstrumentable implements Instrumentable<SampleInstrumentation> {
    public constructor() {
        const hook = (instrumentation: SampleInstrumentation, configuration: InstrumentationConfiguration<SampleInstrumentation>): object => {
            return mapValues(configuration, (parameters, name) => parameters ? (instrumentation as any)[name](null, ...parameters) : {});
        };

        this[InstrumentationHook] = SyncInstrumentationHook.from(hook);
    }

    public readonly [InstrumentationHook]: SyncInstrumentationHook<SampleInstrumentation>;
}

class SampleAsyncInstrumentable implements AsyncInstrumentable<SampleInstrumentation> {
    public constructor() {
        const hook = async (instrumentation: SampleInstrumentation, configuration: InstrumentationConfiguration<SampleInstrumentation>): Promise<object> => {
            return mapValues(configuration, (parameters, name) => parameters ? (instrumentation as any)[name](null, ...parameters) : {});
        };

        this[InstrumentationHook] = AsyncInstrumentationHook.from(hook);
    }

    public readonly [InstrumentationHook]: AsyncInstrumentationHook<SampleInstrumentation>;
}

interface SampleInstrumentation1Result {
    callInstrumentation1(parameter: string): void;
}

interface SampleInstrumentation {
    instrument1(context: null, parameter: number): SampleInstrumentation1Result;
}

interface SampleInstrumentation2Result {
    callInstrumentation2(): void;
}

interface SampleInstrumentation {
    instrument2(context: null, parameter: string): SampleInstrumentation2Result;
}

SampleInstrumentation.prototype.instrument1 = function (context: null, parameter: number): SampleInstrumentation1Result {
    return {
        callInstrumentation1: (): void => {},
    };
};

SampleInstrumentation.prototype.instrument2 = function (context: null, parameter: string): SampleInstrumentation2Result {
    return {
        callInstrumentation2: (): void => {},
    };
};

describe('instrument', () => {
    it('yields output that is a combination of outputs of individual instruments for a synchronous instrumentable', () => {
        const instrumentable = new SampleInstrumentable();

        const result = instrument(instrumentable, SampleInstrumentation)
            .with('instrument1', 20)
            .with('instrument2', '10')
            .complete();

        result.instrument1.callInstrumentation1('test');
        result.instrument2.callInstrumentation2();
    });

    it('yields output that is a combination of outputs of individual instruments for an asynchronous instrumentable and a synchronous instrumentation', async () => {
        const instrumentable = new SampleAsyncInstrumentable();

        return instrument(instrumentable, SampleInstrumentation)
            .with('instrument1', 20)
            .with('instrument2', '10')
            .ready()
            .then((result) => {
                result.instrument1.callInstrumentation1('test');
                result.instrument2.callInstrumentation2();
            });
    });
});

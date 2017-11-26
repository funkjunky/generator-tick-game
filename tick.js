const GeneratorFunction = function*(){}.constructor;

export const TYPE__TICK = '__INTERVAL_TICK__';

//Description, The thing you yield
export const tick = fnc => ({
    type: TYPE__TICK,
    payload: {
        fnc
    }
});

export const generateTickFunctions = () => {
    //Processor adds subscribers, while the middleware runs them
    let subscribers = [];
    //The processor has access to the static effectProcessor
    //so I make it available for the middleware when it processes the generator passed to tick
    let effectProcessor;

    const processor = (effect, { effectGeneratorProcessor }) => {
        effectProcessor = effectGeneratorProcessor;

        if(effect.payload.fnc instanceof GeneratorFunction) {
            return new Promise(resolve => subscribers.push([effect.payload.fnc, resolve]));
        } else {
            return Promise.reject('tick only takes a generator as a callback');
        }
    };

    const middleware = (interval = 1000) => store => {
        let lastTime = Date.now();
        setInterval(() => {
            subscribers.forEach(([fnc, resolver]) => {
                const dt = Date.now() - lastTime;
                lastTime = Date.now();
                if(fnc instanceof GeneratorFunction) {
                    const res = effectProcessor(fnc(dt), { dispatch: store.dispatch });
                    res.then(isComplete => {
                        if(isComplete) {
                            subscribers = subscribers.filter(([fnc, rr]) => rr !== resolver);
                            resolver();
                        }
                    });
                } else {
                    const isComplete = fnc(dt);
                    if(isComplete) {
                        subscribers = subscribers.filter(([fnc, rr]) => rr !== resolver);
                        resolver();
                    }
                }
            });
        }, interval);

        return next => action => next(action);
    };

    return { processor, middleware };
};

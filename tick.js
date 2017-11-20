const GeneratorFunction = function*(){}.constructor;

export const TYPE__TICK = '__SIMPLE_TICK__';

//Description, The thing you yield
export const tick = fnc => ({
    type: TYPE__TICK,
    payload: {
        fnc
    }
});

let subscribers = [];
let effectProcessor;
let _dispatch;

export const processor__tick = (effect, { effectGeneratorProcessor, dispatch }) => {
    //TODO: leaky... but Ineed the effect processor
    effectProcessor = effectGeneratorProcessor;
    _dispatch = dispatch;

    if(effect.payload.fnc instanceof GeneratorFunction) {
        subscribers.push(effect.payload.fnc);
        console.log('adding subscriber. All subs after: ', subscribers);
        // somehow return a promise that is resolved only when the generator returns true??
        return Promise.resolve();
    } else {
        return Promise.reject('tick only takes a generator as a callback');
    }
};

export const tickMiddleware = store => {
    const interval = 100;
    let lastTime = Date.now();
    console.log('starting interval...');
    setInterval(() => {
        subscribers.forEach(f => {
        //console.log('a subscriber...', f);
        const dt = Date.now() - lastTime;
        lastTime = Date.now();
        if(f instanceof GeneratorFunction) {
            effectProcessor(f(dt), { dispatch: _dispatch });
        } else {
            f(dt);
        }
    })}, interval);

    return next => action => next(action);
};

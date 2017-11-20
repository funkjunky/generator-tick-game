//Middleware, if meta.selector, then return the selector as a function.
//Similar to connect's mapStateToProps;

export default store => next => action => {
    if(action.meta && action.meta.selector) {
        next(action);
        return () => action.meta.selector(store.getState());
    }
    console.log('action: ', action);
    next(action);
};

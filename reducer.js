export default (state={}, { type, entity }) => {
    switch(type) {
        case 'ADD_ENTITY':
            return {
                [entity.id]: entity
            };

        default:
            return state;
    }
};

export default (state={}, { type, entity, percent, attack, distance, target }) => {
    switch(type) {
        case 'CREATE_ENTITY':
            return {
                ...state,
                [entity.id]: entity
            };

        case 'REMOVE_ENTITY':
            const newState = { ...state };
            delete newState[entity.id];
            return newState;

        case 'INCREMENT_CONJURE':
            return {
                ...state,
                [entity.id]: {
                    ...state[entity.id],
                    percent: state[entity.id].percent + percent
                }
            };

        case 'SEEK_STEP':
            return {
                ...state,
                [entity.id]: {
                    ...state[entity.id],
                    x: state[entity.id].x + (target.x > state[entity.id].x ? distance : -distance)
                }
            };

        case 'TAKE_DAMAGE':
            return {
                ...state,
                [entity.id]: {
                    ...state[entity.id],
                    hp: state[entity.id].hp - attack.dmg
                }
            };

        default:
            return state;
    }
};

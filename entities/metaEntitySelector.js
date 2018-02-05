export const metaEntitiesSelector = {
    selector: (state, creationState) => {
        const { id } = creationState.entities.end();
        return state.entities[id];
    }
};

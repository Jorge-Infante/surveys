export const setState = (state, { key, value }) => {
  state[key] = value;
};
export const removeState = (state, { key, keySearch }) => {
  state[key] = state[key].filter((item) => item.id !== keySearch);
};
export const addEnty = (state, { key, value }) => {
  state[key] = [value, ...state[key]];
};
export const addInstructive = (state, instructive) => {
  state.instructive = instructive;
};

export const updateState = (state, { key, keySearch, value }) => {
  console.log(key, keySearch, value);
  let index = state[key].findIndex((item) => item.id === keySearch);
  console.log("INDEX: ", index);
  state[key][index] = value;
};

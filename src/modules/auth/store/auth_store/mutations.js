export const setState = (state, { key, value }) => {
  state[key] = value;
};
export const removeState = (state, { key, keySearch, value }) => {
  state[key] = state[key].filter((item) => item[keySearch] !== value);
};
export const addEnty = (state, { key, value }) => {
  state[key] = [value, ...state[key]];
};

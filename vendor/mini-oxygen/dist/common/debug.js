function isO2Verbose() {
  return !!(process.env.DEBUG === "*" || process.env.DEBUG?.includes("o2:*"));
}
export {
  isO2Verbose
};

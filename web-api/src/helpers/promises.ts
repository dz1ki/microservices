export const promises = new Map();

export const rejectAndClearPromiseByTimeout = (
  correlationId,
  promise,
  rejectData,
  ms
) => {
  setTimeout(() => {
    promise.reject(rejectData);
    promises.delete(correlationId);
  }, ms);
};

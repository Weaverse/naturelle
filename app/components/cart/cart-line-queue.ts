export function stagePendingLineUpdate(
  current: Map<string, number>,
  lineId: string,
  quantity: number,
) {
  const next = new Map(current);
  next.set(lineId, quantity);
  return next;
}

export function clearPendingLineUpdate(
  current: Map<string, number>,
  lineId: string,
  submittedQuantity: number,
) {
  if (current.get(lineId) !== submittedQuantity) {
    return current;
  }
  const next = new Map(current);
  next.delete(lineId);
  return next;
}

export function claimPendingLineUpdate(
  pending: Map<string, number>,
  inFlight: Map<string, number>,
  lineId: string,
) {
  const quantity = pending.get(lineId);
  if (quantity === undefined || inFlight.has(lineId)) {
    return { inFlight, quantity: null };
  }

  const nextInFlight = new Map(inFlight);
  nextInFlight.set(lineId, quantity);
  return { inFlight: nextInFlight, quantity };
}

export function settlePendingLineUpdate(
  pending: Map<string, number>,
  inFlight: Map<string, number>,
  lineId: string,
  submittedQuantity: number,
) {
  if (inFlight.get(lineId) !== submittedQuantity) {
    return { pending, inFlight };
  }

  const nextInFlight = new Map(inFlight);
  nextInFlight.delete(lineId);
  return {
    pending: clearPendingLineUpdate(pending, lineId, submittedQuantity),
    inFlight: nextInFlight,
  };
}

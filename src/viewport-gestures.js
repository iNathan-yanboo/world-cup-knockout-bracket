const defaultZoomBounds = { min: 0.24, max: 1.28 };

function roundViewNumber(value) {
  return Math.round(value * 1000) / 1000;
}

export function clampScale(scale, bounds = defaultZoomBounds) {
  return Math.min(bounds.max, Math.max(bounds.min, scale));
}

export function getPointerDistance(pointers) {
  if (pointers.length < 2) {
    return 0;
  }

  return Math.hypot(pointers[1].x - pointers[0].x, pointers[1].y - pointers[0].y);
}

export function getPointerCenter(pointers) {
  if (pointers.length < 2) {
    return pointers[0] ? { x: pointers[0].x, y: pointers[0].y } : { x: 0, y: 0 };
  }

  return {
    x: (pointers[0].x + pointers[1].x) / 2,
    y: (pointers[0].y + pointers[1].y) / 2
  };
}

export function applyPinchZoom({
  startView,
  startDistance,
  startCenter,
  currentPointers,
  bounds = defaultZoomBounds
}) {
  const currentDistance = getPointerDistance(currentPointers);

  if (!startDistance || !currentDistance) {
    return startView;
  }

  const currentCenter = getPointerCenter(currentPointers);
  const nextScale = clampScale(
    startView.scale * (currentDistance / startDistance),
    bounds
  );
  const contentX = (startCenter.x - startView.x) / startView.scale;
  const contentY = (startCenter.y - startView.y) / startView.scale;

  return {
    x: roundViewNumber(currentCenter.x - contentX * nextScale),
    y: roundViewNumber(currentCenter.y - contentY * nextScale),
    scale: roundViewNumber(nextScale)
  };
}

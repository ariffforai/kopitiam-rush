// input.js — mouse clicks and keyboard shortcuts for KOPITIAM RUSH.
// The canvas reports every click in logical 1280x800 coordinates, and
// keys 1-8 add ingredients, S serves, T trashes the plate, M mutes.

export function logicalPosition(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
}

export function installInput(canvas, handlers) {
  canvas.addEventListener('click', (event) => {
    const pos = logicalPosition(canvas, event.clientX, event.clientY);
    handlers.onClick(pos.x, pos.y);
  });
  canvas.addEventListener('mousemove', (event) => {
    const pos = logicalPosition(canvas, event.clientX, event.clientY);
    handlers.onHover(pos.x, pos.y);
  });
  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const key = event.key.toLowerCase();
    if (key >= '1' && key <= '8') {
      handlers.onIngredientKey(Number(key) - 1);
    } else if (key === 's') {
      handlers.onServeKey();
    } else if (key === 't') {
      handlers.onTrashKey();
    } else if (key === 'm') {
      handlers.onMuteKey();
    } else if (key === 'enter' || key === ' ') {
      handlers.onConfirmKey();
    }
  });
}

// Hit test: is the point inside this rectangle?
export function hitRect(x, y, rect) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

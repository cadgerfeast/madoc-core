export async function frame (frames = 1) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, frames);
  });
}

export function goTo (href) {
  const anchor = document.createElement('a');
  if (href.startsWith('#')) {
    const origin = `${window.location.origin}${window.location.pathname}`;
    anchor.href = `${origin}${href}`;
  } else {
    anchor.href = href;
  }
  anchor.click();
}

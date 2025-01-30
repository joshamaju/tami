document.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;

  if (target.classList.contains("js-key-value-remove")) {
    const key = target.dataset.key;

    if (key) {
      document.getElementById(key)?.remove();
    }
  }
});

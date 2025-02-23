document.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;

  if (target.hasAttribute("data-row-action")) {
    const index = target.dataset.index;
    const action = target.dataset.rowAction;

    if (action == "remove") {
      const id = target.dataset.rowTarget;

      if (id) {
        document.getElementById(id)?.remove();
      }
    }

    if (action == "new") {
      const name = target.dataset.name;
      const template = document.querySelector(`[data-row-template='${name}']`);

      const clone = template?.cloneNode(true) as HTMLElement | undefined;

      const key = clone?.querySelector('[data-slot="key"]');
      const value = clone?.querySelector('[data-slot="value"]');

      const remove = clone?.querySelector('[data-row-action="remove"]');

      const k = key as HTMLInputElement | null;
      const v = value as HTMLInputElement | null;

      const id = crypto.randomUUID();
      const i = (index ? parseFloat(index) : 0) + 1;

      if (k) {
        k.name = `${name}[${i}][key]`;
        k.value = "";
      }

      if (v) {
        v.name = `${name}[${i}][value]`;
        v.value = "";
      }

      if (remove) {
        remove.removeAttribute("hidden");
        remove.removeAttribute("disabled");
        remove.setAttribute("data-row-target", id);
      }

      if (clone) {
        clone.id = id;
        clone?.removeAttribute("hidden");
        clone?.removeAttribute("data-row-template");
        clone?.setAttribute("data-row-index", i.toString());
        template?.parentElement?.insertBefore(clone, template);
        target.setAttribute("data-index", i.toString());
      }
    }
  }
});

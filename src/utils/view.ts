import { resolve_component } from "stack54/render";
import { type TemplateModule } from "stack54/types";

const components = import.meta.glob<TemplateModule>(
  "../views/**/*.html.svelte"
);

export const resolve = (name: string) => {
  return resolve_component(
    [`../views/${name}`, `../views/${name}.html.svelte`],
    components
  );
};

<script lang="ts">
  import { Head, LiveReload } from "stack54/components";
</script>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
    <link rel="icon" href="/favicon.ico" type="image/x-icon" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link
      rel="preconnect"
      crossorigin="true"
      href="https://fonts.gstatic.com"
    />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap"
    />

    <link rel="stylesheet" href="./tailwind.css" />
    <slot name="head" />

    <Head />
    <LiveReload />
  </head>
  <body>
    <slot />
  </body>
</html>

import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import pkg from "../../package.json" assert { type: "json" };

type Package = {
  name: string;
  version: string;
  keywords: string[];
  description: string;
};

const url = `https://registry.npmjs.org/${pkg.name}/latest`;

export const version_check = pipe(
  TE.tryCatch(() => fetch(url), E.toError),
  TE.chain((_) => TE.tryCatch(() => _.json(), E.toError)),
  TE.map((_) => _ as Package),
  TE.match(
    () => O.none,
    (_) => O.some(_.version)
  )
);

import { Option } from "fp-ts/lib/Option";

declare module "stack54/locals" {
  interface Locals {
    version: {
      current: string;
      latest: Option<string>;
    };
  }
}

export {};

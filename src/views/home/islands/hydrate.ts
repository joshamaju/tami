import { decode } from "stack54/data";
import type { IRequest } from "../../../types/session";
import UrlBar from "./url-bar.svelte";
import UrlParams from "./url-params.svelte";
import Headers from "./headers.svelte";

type Data = {
  request: Partial<IRequest>;
};

const data = decode<Data>("HYDRATION_DATA");

const url = data?.request.url ?? "";

const url_container = document.getElementById("url-container");
const query_container = document.getElementById("query-container");
const headers_container = document.getElementById("headers-container");

if (url_container) {
  new UrlBar({ hydrate: true, props: { url }, target: url_container });
}

if (query_container) {
  new UrlParams({ hydrate: true, props: { url }, target: query_container });
}

if (headers_container) {
  new Headers({
    hydrate: true,
    target: headers_container,
    props: { data: data?.request.headers ?? {} },
  });
}

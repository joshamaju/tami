import { KeyValue } from "./key-value.component";

if (!customElements.get(KeyValue.TAG)) {
  customElements.define(KeyValue.TAG, KeyValue);
}

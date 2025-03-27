import mitt from "mitt";

type Events = {
  url_change: string;
  header_change: { key: string; value: string };
};

export const emitter = mitt<Events>();

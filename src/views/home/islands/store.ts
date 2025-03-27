import mitt from "mitt";

type Events = {
  url_change: string;
};

export const emitter = mitt<Events>();

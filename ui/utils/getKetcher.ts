import { type Ketcher } from "ketcher-core";

export function getKetcher(): Ketcher {
  const ketcherIframe = document.getElementById("ketcher") as HTMLIFrameElement;
  const ketcherContentWindow = ketcherIframe.contentWindow as Window & { ketcher: Ketcher };
  const ketcher = ketcherContentWindow.ketcher;
  return ketcher;
}

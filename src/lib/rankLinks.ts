import { REGEX_IGNORED_DOMAINS } from "./constants";

export function rankLinks(links: string[]): string[] {
  return links
    .filter((link) => !REGEX_IGNORED_DOMAINS.test(link)) // ignore unwanted words/domains
    .sort((x) => x.length)                               // priorize longer links, those are more likely to be posts instead of homepages
    .sort((v) => v.match("free") ? 1 : -1 )              // depriorize links with free in their name
    .sort((v) => v.match("torrent") ? -1 : 1 )           // priorize links with torrent in their name
}
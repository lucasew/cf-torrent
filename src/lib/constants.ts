const ignoredDomains = [
    "archive.org",
    "drive.google.com",
    "facebook.com",
    "imdb.com",
    "proxy",
    "reddit.com",
    "sites.google.com",
    "torrentfreak",
    "vpn",
    "wixsite.com",
    "youtube.com",
    "linkedin.com",
    "wikipedia.org",
]


export const REGEX_IGNORED_DOMAINS = new RegExp(ignoredDomains.join("|"), 'i')

export const REGEX_MATCH_MAGNET = /(magnet:[^"' ]*)/g
export const REGEX_MATCH_INFOHASH = /[0-9A-F]{40}/




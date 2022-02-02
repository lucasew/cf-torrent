# cf-torrent

Simple cloudflare worker to search for torrent sites and declutter them

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/lucasew/cf-torrent)

**WARNING**: This thing don't store any illegal data, the torrents are already on the Internet and the utility only saves you a few minutes finding the X in the ads or get trolled by fake links.

The utility already tries to use both Google and DuckDuckGo, then get the site links of the first page and crawls the sites for magnet links inside the static HTML.

If the search fails, it's treated as if there is nothing found.

If the site loading takes more than 2s it's treated as if the site do not have any magnet link.

You only gets what really matters: the magnet links.

**The search query is your responsibility**

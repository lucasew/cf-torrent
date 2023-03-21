import decodeBencode from './bencode_decode'

export async function decodeTorrent(torrent: ArrayBuffer) {
    const unbencode = decodeBencode(torrent)
    const { infohashFrom, infohashTo } = unbencode
    const bufSlice = torrent.slice(infohashFrom, infohashTo)
    const digest = await crypto.subtle.digest({name: 'SHA-1'}, bufSlice)
    const hexDigest = [...new Uint8Array(digest)]
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase()
    delete unbencode.infohashFrom
    delete unbencode.infohashTo
    unbencode['infohash'] = hexDigest
    return unbencode
}
export async function load({fetch, url}) {
    const parsedURL = new URL(url)
    parsedURL.pathname += "/_data"
    console.log(parsedURL)
    const res = await fetch(parsedURL)
    const json = await res.json()
    return json
}



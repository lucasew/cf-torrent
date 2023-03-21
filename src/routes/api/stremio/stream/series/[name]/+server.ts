export async function GET({params, url}) {
    // console.log(params, url)
    return new Response(JSON.stringify({
        streams: []
    }), {
        headers: {
            'content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })
}
export function GET(params) {
    console.log(params)
    return new Response(JSON.stringify(params), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
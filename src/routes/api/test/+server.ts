export function GET({ url }) {
    return new Response(JSON.stringify({url}), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
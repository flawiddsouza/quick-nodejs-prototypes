import { getQuickJS } from 'quickjs-emscripten'
import { Arena } from 'quickjs-emscripten-sync'

function createRequestContextForPlugin(request, environment) {
    let state = {
        requestBody: JSON.parse(JSON.stringify(request.body))
    }

    return {
        request: {
            getBody() {
                return state.requestBody
            },
            getEnvironmentVariable(variable) {
                return JSON.parse(JSON.stringify(environment[variable]))
            },
            setBody(requestBody) {
                state.requestBody = requestBody
            }
        }
    }
}

function createResponseContextForPlugin(response, environment) {
    let state = {
        responseBody: JSON.parse(JSON.stringify(response.body))
    }

    return {
        response: {
            getBody() {
                return state.responseBody
            },
            getEnvironmentVariable(variable) {
                return JSON.parse(JSON.stringify(environment[variable]))
            },
            setBody(responseBody) {
                state.responseBody = responseBody
            }
        }
    }
}

async function usePlugin(context, plugin) {
    const vm = (await getQuickJS()).createVm()
    const arena = new Arena(vm, { isMarshalable: true })

    arena.expose({
        console: {
            log: console.log
        },
        context
    })

    arena.evalCode(plugin.code)

    arena.dispose()
    vm.dispose()
}

const code = `
if('request' in context) {
    let body = { ...context.request.getBody(), mimeType: 'text/plain' }
    context.request.setBody(body)
}

if('response' in context) {
    let body = { ...context.response.getBody(), status: 'aaaaaaaaaaaa' }
    context.response.setBody(body)
}
`

async function runPlugin() {
    const requestContext = createRequestContextForPlugin({
        url: 'https://google.com',
        body: {
            mimeType: 'application/x-www-form-urlencoded',
            params: [
                { 'key': 1, value: 2 }
            ]
        }
    }, {})
    console.log('request body before', requestContext.request.getBody())

    await usePlugin(requestContext, {
        code: code
    })

    console.log('request body after', requestContext.request.getBody())

    const responseContext = createResponseContextForPlugin({
        body: { status: 'Success', message: 'Hello' }
    }, {})

    console.log('response body before', responseContext.response.getBody())

    await usePlugin(responseContext, {
        code: code
    })

    console.log('response body after', responseContext.response.getBody())
}

runPlugin()

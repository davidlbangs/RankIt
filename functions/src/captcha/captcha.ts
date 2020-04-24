const functions = require('firebase-functions')
const rp = require('request-promise')

export const checkRecaptcha = functions.https.onRequest((req, res) => {

  res.set('Access-Control-Allow-Origin', "*")
  res.set('Access-Control-Allow-Methods', 'GET, POST')
  res.set('Content-Type', 'application/json')
    const response = req.query.response
    console.log("recaptcha response", response)
    rp({
        uri: 'https://recaptcha.google.com/recaptcha/api/siteverify',
        method: 'POST',
        formData: {
            secret: '6LdzPOwUAAAAAL2mkRP0y89kP-LF-nixd6KoojW_',
            response: response
        },
        json: true
    }).then(result => {
        console.log("recaptcha result", result)
        if (result.success) {
            res.send("{\"status\":true}")
        }
        else {
            res.send("{\"status\":false}")
        }
    }).catch(reason => {
        console.log("Recaptcha request failure", reason)
        res.send("{\"status\":true}")
    })
})
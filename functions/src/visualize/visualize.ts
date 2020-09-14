const functions = require('firebase-functions')
const rp = require('request-promise')

export const visualize = functions.https.onRequest((req, res) => {

  res.set('Access-Control-Allow-Origin', "*")
  res.set('Access-Control-Allow-Methods', 'GET, POST')
  res.set('Access-Control-Allow-Headers', '*')
  res.set('Content-Type', 'application/json')
    if (req.query.stayalive) {
        res.send("{\"status\":false}")
        return;
    }
    const jsonFile = req.body
    console.log("rectcha jsonFile", jsonFile)
console.log("content of the file: ", JSON.stringify(jsonFile))
   // const blob = new Blob([JSON.stringify(jsonFile)], {type : 'application/json'})
    rp({
        uri: 'https://www.rcvis.com/api/visualizations/',
        method: 'POST',
        formData: {
            jsonFile: {
                value: JSON.stringify(jsonFile),
                options: {
                    filename: 'rankit-data-'+Math.floor(Math.random()*1000000+1000000)+'.json',
                    contentType: 'application/json'
                }
            }
        },
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Token 1abcc2baa9cc264aaf5ba56d109e91a96e08ac14'
        }
    }).then(result => {
        res.send(result)
        
    }).catch(reason => {
        console.log("request failure", reason)
        res.send("{\"status\":false}")
    })
})
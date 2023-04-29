import axios from 'axios'

const requestCodeUrl = "/api/v1/user/request-code"
const registerUrl = "/api/v1/user/register"

interface Message {
    status: string
    data: any
}

const requestCode = async (body: Object): Promise<void> => {
    await axios.post(requestCodeUrl, body)
        .then(function (response) {
            //console.log(response)
            response.status
        })
        .catch(function(error) {
            //console.log(error)
        })
}

const register = async (req: Request) => {

};

export default requestCode
import axios from 'axios'

const requestCodeUrl = "/api/v1/user/request-code"
const registerUrl = "/api/v1/user/register"

interface Message {
    status: string
    data: any
}

const requestCode = async (body: any): any => {
    await axios.post(requestCodeUrl, body)
        .then(function (response) {
            //console.log(response)
            response.status
        })
        .catch(function(error) {
            //console.log(error)
        })
}

const register = async (req: Request): Promise<Response> => {
    try {
      const response = await fetch(registerUrl);
  
      return new Response(JSON.stringify(models), { status: 200 });
    } catch (error) {
      console.error(error);
      return new Response('Error', { status: 500 });
    }
};

export default {requestCode, register}
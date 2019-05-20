// handler.js

const aws = require('aws-sdk')
const ses = new aws.SES()
const myEmail = 'david@whizziwig.com'
const myDomain = '*'

function generateResponse (code, payload) {
  return {
    statusCode: code,
    headers: {
      'Access-Control-Allow-Origin': myDomain,
      'Access-Control-Allow-Headers': 'x-requested-with',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(payload)
  }
}

function generateError (code, err) {
  console.log(err)
  return {
    statusCode: code,
    headers: {
      'Access-Control-Allow-Origin': myDomain,
      'Access-Control-Allow-Headers': 'x-requested-with',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(err.message)
  }
}

function generateEmailParams (body) {
  const { email, name } = body // JSON.parse(body)
  console.log(email, name)
  if (!(email && name )) {
    throw new Error('Missing parameters! Make sure to add parameters \'email\', \'name\', \'content\'.')
  }

  return {
    Source: myEmail,
    Destination: { ToAddresses: [myEmail] },
    ReplyToAddresses: [myEmail],
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `Message sent from email ${email} by ${name} \nContent: XXXX`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `You received a message from ${myDomain}!`
      }
    }
  }
}

function send_email {
  console.log(event)
  try {
    const emailParams = generateEmailParams(event)
    const data = await ses.sendEmail(emailParams).promise()
    return generateResponse(200, data)
  } catch (err) {
    return generateError(500, err)
  }
}

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports.handler = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const token = requestBody.token.id;
  const amount = requestBody.charge.amount;
  const currency = requestBody.charge.currency;

  return stripe.charges.create({ // Create Stripe charge with token
    amount,
    currency,
    description: 'Serverless Stripe Test charge',
    source: token,
  })
    .then((charge) => { // Success response
      const response = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          message: `Charge processed succesfully!`,
          charge,
        }),
      };
      callback(null, response);
    })
    .catch((err) => { // Error response
      const response = {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: err.message,
        }),
      };
      callback(null, response);
    })
};

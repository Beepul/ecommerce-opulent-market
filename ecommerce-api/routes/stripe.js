const express = require('express')
const Stripe = require('stripe')
const Order = require('../models/orderModel')
const Address = require('../models/addressModel')
const Transaction = require('../models/transactionModel')
const User = require('../models/userModel')
const { sendEmail } = require('../utils/mailer')
const Product = require('../models/productModel')
const BError = require('../utils/error')

require('dotenv').config()

const stripe = Stripe(process.env.STRIPE_SK_KEY)


const stripeRoute = express.Router()
const stripeWebhookRoute = express.Router()

stripeRoute.post('/create-checkout-session', async (req, res) => {
  try {
    const {cart,userId,address} = req.body
    // console.log("Cart ::",cart)
    // console.log("Address::",address)
  
    if(!cart || cart.length <= 0){
      res.status(400).json({
        message: "There must be at lease one item in the cart"
      })
    }

    for (const item of cart) {
      if (item.quantity <= 0) {
          throw new BError('Please increase the quantity of the product to purchase',400);
      }
    }

    await validateProductStock(cart,res);

    const customer = await stripe.customers.create({
      metadata: {
        userId: userId,
        cart: JSON.stringify(cart.map((c) => {
          return {
            name: c.name,
            _id: c._id,
            quantity: c.quantity,
            price: c.price,
            afterDiscountPrice: c.afterDiscountPrice
          }
        })),
        address: JSON.stringify(address)
      }
    })
  
    const line_items = cart.map((item) => {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
              name: item.name,
              images: [item.images[0].url],
              description: item.description,
              metadata: {
                id: item._id
              }
          },
          unit_amount: item.afterDiscountPrice * 100,
        },
        quantity: item.quantity
      }
    })
    // console.log(line_items)
    const session = await stripe.checkout.sessions.create({
      line_items,
      customer: customer.id,
      phone_number_collection: {
        enabled: true,
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 2000,
              currency: 'usd'
            },
            display_name: 'Shipping Charge',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5
              },
              maximum: {
                unit: 'business_day',
                value: 7
              }
            }
          }
        }
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/checkout-success`,
      cancel_url: `${process.env.CLIENT_URL}/payment`,
    });
  
    res.send({url: session.url});
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: error.message
    })
  }
});





stripeWebhookRoute.post('/', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];
  // console.log({sig})
  // console.log("RAW BODY FROM STRING:: ", request.body)
  // console.log("STRIPE ENDPOINT SK KEY:: ",process.env.STRIPE_ENDPOINT_SK_KEY)

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_ENDPOINT_SK_KEY);
    // console.log('Webhook Event::', event)
  } catch (err) {
    console.log(`Webhook Error:: ${err.message}`)
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const data = event.data.object;
      stripe.customers.retrieve(data.customer).then( async (customer) => {
        const {cart,userId,address} = customer.metadata

        // console.log(userId)
        // console.log({cart,userId,address});
        // console.log("data::", data);

        const user = await User.findById(userId)

        const addressExist = await Address.find({user: userId})

        if(addressExist.length >=1 || addressExist){
          await Address.deleteMany({user: userId})
      }

        // Create Address
        let addressData = JSON.parse(address)
        addressData.user = userId
        const userAddress = await Address.create(addressData)

        console.log("Address Created")

        // Create Order
        const orderData = {
          user: userId,
          items: JSON.parse(cart).map((c) => {
            return {
              product: c._id,
              quantity: c.quantity
            }
          }),
          totalPrice: data.amount_total / 100,
          status: 'processing',
          shippingAddress: userAddress._id,
          paymentDetails: {
            paymentMethod: 'online',
            paymentStatus: 'paid',
          }
        }

        const order = await Order.create(orderData)

        console.log("Order Created")

        // Create Transaction

        const transactionData = {
          user: userId,
          order: order._id,
          amount_subtotal: data.amount_subtotal / 100,
          shipping_cost: data.total_details.amount_shipping / 100,
          amount: data.amount_total / 100,
          payment_status: data.payment_status,
          paidAt: Date.now()
        }

        const transaction = await Transaction.create(transactionData)

        console.log("Transaction Created")

        sendEmail({
          email: user.email,
          subject: 'Seven Shop Purchase Confirm',
          message: `
              <h2>Hello ${user.name}</h2>
              <p>Thank you for choosing us. Your product will be on the way soon.</p>
          `
        })

        await updateProductStock(JSON.parse(cart));

      }).catch(err => {
        console.log(err.message)
        throw new BError(err.message || 'Payment failed', 500)
      });
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send().end();
});


const validateProductStock = async (items,res) => {
  for (const item of items) {
      const product = await Product.findById(item._id);

      if (!product || product.stockQuantity < item.quantity) {
          throw new BError(`Insufficient stock for ${product.name}`, 400);
      }
  }
};

const updateProductStock = async (items) => {
  for (const item of items) {
      const product = await Product.findById(item._id);
      product.stockQuantity -= item.quantity;
      await product.save();
  }
};


module.exports = {stripeRoute,stripeWebhookRoute}
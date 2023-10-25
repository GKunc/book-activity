const stripe = require('stripe')(
  'sk_test_51NCjxHDtchbgKw9RIyWyh9CxCepYkSHtpfY7zkNBK5bMmlMLZqs9DQUeK8MOvMlkkb9x02dNR9jSYajG1XTg5XCx00GOksWzRQ'
);

exports.createSubscription = async (req, res) => {
  const priceId = req.body.priceId;

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.PAYMENT_CONFIRMATION}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.PAYMENT_CANCELLED}`,
  });

  console.log(session);
  return res.send(JSON.stringify(session.url));
};

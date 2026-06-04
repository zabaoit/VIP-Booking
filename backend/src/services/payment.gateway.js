import axios from 'axios';
import crypto from 'crypto';

  // MOMO
export const createMomoPayment = async ({ orderId, amount }) => {
  const requestId = orderId.toString();

  const rawSignature =
    `accessKey=${process.env.MOMO_ACCESS_KEY}` +
    `&amount=${amount}` +
    `&extraData=` +
    `&ipnUrl=${process.env.MOMO_IPN}` +
    `&orderId=${orderId}` +
    `&orderInfo=Thanh toan VIP Booking` +
    `&partnerCode=${process.env.MOMO_PARTNER_CODE}` +
    `&redirectUrl=${process.env.MOMO_REDIRECT}` +
    `&requestId=${requestId}` +
    `&requestType=payWithMethod`;

  const signature = crypto
    .createHmac('sha256', process.env.MOMO_SECRET_KEY)
    .update(rawSignature)
    .digest('hex');

  const body = {
    partnerCode: process.env.MOMO_PARTNER_CODE,
    partnerName: 'VIP Booking',
    storeId: 'VIPBookingStore',
    requestId,
    amount: Number(amount),
    orderId: orderId.toString(),
    orderInfo: 'Thanh toan VIP Booking',
    redirectUrl: process.env.MOMO_REDIRECT,
    ipnUrl: process.env.MOMO_IPN,
    lang: 'vi',
    requestType: 'payWithMethod',
    autoCapture: true,
    extraData: '',
    signature,
  };

  const res = await axios.post(
    process.env.MOMO_ENDPOINT,
    body
  );

  console.log('MOMO RESPONSE:', res.data);
if (!res.data.payUrl) {
  throw new Error(JSON.stringify(res.data));
}
  return res.data.payUrl;
};


  // ZALOPAY

export const createZaloPay = async ({ orderId, amount }) => {
const app_time = Date.now();
  const app_trans_id = `${new Date()
    .toISOString()
    .slice(2, 10)
    .replace(/-/g, '')}_${orderId}`;

  const embed_data = JSON.stringify({
    redirecturl: 'http://localhost:5173/payment-result',
  });

  const item = '[]';

  const data =
    process.env.ZALOPAY_APP_ID +
    '|' +
    app_trans_id +
    '|user123|' +
    amount +
    '|' +
    app_time +
    '|' +
    embed_data +
    '|' +
    item;

  const mac = crypto
    .createHmac('sha256', process.env.ZALOPAY_KEY1)
    .update(data)
    .digest('hex');

  const params = {
    app_id: process.env.ZALOPAY_APP_ID,
    app_user: 'user123',
    app_time,
    amount,
    app_trans_id,
    embed_data,
    item,
    description: `VIP Booking #${orderId}`,
    callback_url: process.env.ZALOPAY_CALLBACK,
    mac,
  };

  try {
  const res = await axios.post(
    process.env.ZALOPAY_ENDPOINT,
    null,
    { params }
  );

  console.log('ZaloPay:', res.data);

  if (!res.data.order_url) {
    throw new Error(JSON.stringify(res.data));
  }

  return res.data.order_url;

} catch (err) {
  console.error(
    'ZaloPay Error:',
    err.response?.data || err.message
  );

  throw err;
  }
};


   //VIETQR

export const createVietQR = ({ bank, account, amount, content }) => {
  return `https://img.vietqr.io/image/${bank}-${account}-compact.png?amount=${amount}&addInfo=${content}`;
};

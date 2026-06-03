import axios from 'axios';
import crypto from 'crypto';

  // MOMO
export const createMomoPayment = async ({ orderId, amount }) => {
  const requestId = orderId;

  const rawSignature =
    `accessKey=${process.env.MOMO_ACCESS_KEY}` +
    `&amount=${amount}` +
    `&ipnUrl=${process.env.MOMO_IPN}` +
    `&orderId=${orderId}` +
    `&orderInfo=Thanh toan ${orderId}` +
    `&partnerCode=${process.env.MOMO_PARTNER_CODE}` +
    `&redirectUrl=${process.env.MOMO_REDIRECT}` +
    `&requestId=${requestId}` +
    `&requestType=captureWallet`;

  const signature = crypto
    .createHmac('sha256', process.env.MOMO_SECRET_KEY)
    .update(rawSignature)
    .digest('hex');

  const body = {
    partnerCode: process.env.MOMO_PARTNER_CODE,
    requestId,
    orderId,
    amount,
    orderInfo: `Thanh toán ${orderId}`,
    redirectUrl: process.env.MOMO_REDIRECT,
    ipnUrl: process.env.MOMO_IPN,
    requestType: 'captureWallet',
    signature,
    lang: 'vi',
  };

  const res = await axios.post(process.env.MOMO_ENDPOINT, body);
  return res.data.payUrl;
};


  // ZALOPAY

export const createZaloPay = async ({ orderId, amount }) => {
  const app_trans_id = `${Date.now()}_${orderId}`;

  const data =
    process.env.ZALOPAY_APP_ID +
    '|' +
    app_trans_id +
    '|user123|' +
    amount +
    '|' +
    Date.now() +
    '||';

  const mac = crypto
    .createHmac('sha256', process.env.ZALOPAY_KEY1)
    .update(data)
    .digest('hex');

  const params = {
    app_id: process.env.ZALOPAY_APP_ID,
    app_trans_id,
    app_user: 'user123',
    app_time: Date.now(),
    amount,
    description: `VIP Booking ${orderId}`,
    mac,
  };

  const res = await axios.post(process.env.ZALOPAY_ENDPOINT, null, {
    params,
  });

  return res.data.order_url;
};


   //VIETQR

export const createVietQR = ({ bank, account, amount, content }) => {
  return `https://img.vietqr.io/image/${bank}-${account}-compact.png?amount=${amount}&addInfo=${content}`;
};
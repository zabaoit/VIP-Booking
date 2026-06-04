import { findInvoiceById, updateInvoiceRecord } from '../models/invoice.model.js';
import {
  createPaymentRecord,
  deletePaymentRecord,
  findPaymentById,
  findPayments,
  updatePaymentRecord,
} from '../models/payment.model.js';
import { findPublicUserById } from '../models/user.model.js';
import { createHttpError } from '../utils/response.js';
import {
  createMomoPayment,
  createZaloPay,
  createVietQR,
} from './payment.gateway.js';
export const createPaymentGateway = async (payload) => {
  const { provider, invoiceId, amount } = payload;
  if (!invoiceId) {
 throw createHttpError(400,'invoiceId missing');
}

  if (!['momo', 'zalopay', 'vietqr'].includes(provider)) {
 throw createHttpError(400, 'Provider không hợp lệ');
  }
  let url = '';

if (provider === 'momo') {
  url = await createMomoPayment({
    orderId: invoiceId,
    amount,
  });
}

if (provider === 'zalopay') {
  url = await createZaloPay({
    orderId: invoiceId,
    amount,
  });
}

if (provider === 'vietqr') {
  url = createVietQR({
    bank: process.env.VIETQR_BANK,
    account: process.env.VIETQR_ACCOUNT,
    amount,
    content: `VIETQR-${invoiceId}`,
  });
}
  return url;
};
const ensureAdminUser = async (userId) => {
  const user = await findPublicUserById(userId);

  if (!user || user.role?.role_name !== 'admin') {
    throw createHttpError(400, 'Nguoi thuc hien phai la admin');
  }
};

export const listPayments = (filters) => {
  return findPayments(filters);
};

export const getPayment = async (paymentId) => {
  const payment = await findPaymentById(paymentId);

  if (!payment) {
    throw createHttpError(404, 'Khong tim thay thanh toan');
  }

  return payment;
};

export const addPayment = async (payload, actor) => {
  const invoice = await findInvoiceById(payload.invoice_id);

  if (!invoice) {
    throw createHttpError(400, 'Hoa don khong ton tai');
  }

  const staffId = payload.staff_id || actor.id;
  if (payload.staff_id) {
  await ensureAdminUser(payload.staff_id);
}

  const payment = await createPaymentRecord({
    invoice_id: BigInt(payload.invoice_id),
    amount: payload.amount.toString(),
    payment_method: payload.payment_method,
    status: payload.status || 'pending',
    paid_at: payload.paid_at ? new Date(payload.paid_at) : new Date(),
    staff_id: BigInt(staffId),
  });

  if (payment.status === 'success') {
    const paidAmount =
      invoice.payments.reduce((total, item) => {
        return item.status === 'success' ? total + Number(item.amount) : total;
      }, 0) + Number(payment.amount);
    const totalAmount = Number(invoice.total_amount);

    await updateInvoiceRecord(invoice.invoice_id, {
      invoice_status: paidAmount >= totalAmount ? 'paid' : 'partial_paid',
      updated_at: new Date(),
    });
  }

  return payment;
};

export const editPayment = async (paymentId, payload) => {
  await getPayment(paymentId);

  if (payload.staff_id) {
    await ensureAdminUser(payload.staff_id);
  }

  return updatePaymentRecord(paymentId, {
    ...(payload.amount !== undefined ? { amount: payload.amount.toString() } : {}),
    ...(payload.payment_method ? { payment_method: payload.payment_method } : {}),
    ...(payload.status ? { status: payload.status } : {}),
    ...(payload.paid_at ? { paid_at: new Date(payload.paid_at) } : {}),
    ...(payload.staff_id ? { staff_id: BigInt(payload.staff_id) } : {}),
  });
};

export const removePayment = async (paymentId) => {
  await getPayment(paymentId);
  await deletePaymentRecord(paymentId);
};

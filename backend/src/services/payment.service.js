import { findInvoiceById, updateInvoiceRecord } from '../models/invoice.model.js';
import {
  createPaymentRecord,
  deletePaymentRecord,
  findPaymentById,
  findPayments,
  updatePaymentRecord,
} from '../models/payment.model.js';
import { createHttpError } from '../utils/response.js';

export const listPayments = (filters) => {
  return findPayments(filters);
};

export const getPayment = async (paymentId) => {
  const payment = await findPaymentById(paymentId);

  if (!payment) {
    throw createHttpError(404, 'Không tìm thấy thanh toán');
  }

  return payment;
};

export const addPayment = async (payload, actor) => {
  const invoice = await findInvoiceById(payload.invoice_id);

  if (!invoice) {
    throw createHttpError(400, 'Hóa đơn không tồn tại');
  }

  const payment = await createPaymentRecord({
    invoice_id: BigInt(payload.invoice_id),
    amount: payload.amount.toString(),
    payment_method: payload.payment_method,
    status: payload.status || 'pending',
    paid_at: payload.paid_at ? new Date(payload.paid_at) : new Date(),
    staff_id: BigInt(payload.staff_id || actor.id),
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

import { z } from 'zod';

import {
  addPayment,
  editPayment,
  getPayment,
  listPayments,
  removePayment,
  createPaymentGateway,
} from '../services/payment.service.js';

import { sendSuccess, handleControllerError } from '../utils/response.js';

export const createGateway = async (req, res) => {
  try {
    const { provider, invoiceId, amount } = req.body;

    const url = await createPaymentGateway({
      provider,
      invoiceId,
      amount,
    });

    return sendSuccess(res, {
      data: { url },
    });
  } catch (err) {
    return handleControllerError(res, err);
  }
};
const idSchema = z.string().regex(/^\d+$/, 'ID không hợp lệ');

const paymentMethodSchema = z.enum([
  'cash',
  'bank_transfer',
  'momo',
  'zalopay',
  'vietqr',
  'online',
]);

const paymentStatusSchema = z.enum([
  'pending',
  'success',
  'failed',
  'refunded',
]);

const decimalSchema = z.union([z.string(), z.number()]);

const schema = z.object({
  invoice_id: idSchema,
  amount: decimalSchema,
  payment_method: paymentMethodSchema,
  status: paymentStatusSchema.optional(),
  paid_at: z.string().optional(),
  staff_id: idSchema.optional(),
});

const updateSchema = schema.omit({ invoice_id: true }).partial();

const querySchema = z.object({
  invoiceId: idSchema.optional(),
  staffId: idSchema.optional(),
  status: paymentStatusSchema.optional(),
});
export const index = async (req, res) => {
  try {
    const payments = await listPayments(querySchema.parse(req.query));
    return sendSuccess(res, { data: { payments } });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const show = async (req, res) => {
  try {
    const payment = await getPayment(idSchema.parse(req.params.id));
    return sendSuccess(res, { data: { payment } });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const store = async (req, res) => {
  try {
    const payment = await addPayment(schema.parse(req.body), req.user);

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Tạo thanh toán thành công',
      data: { payment },
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const update = async (req, res) => {
  try {
    const payment = await editPayment(
      idSchema.parse(req.params.id),
      updateSchema.parse(req.body)
    );

    return sendSuccess(res, {
      message: 'Cập nhật thanh toán thành công',
      data: { payment },
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const destroy = async (req, res) => {
  try {
    await removePayment(idSchema.parse(req.params.id));
    return sendSuccess(res, { message: 'Xóa thanh toán thành công' });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

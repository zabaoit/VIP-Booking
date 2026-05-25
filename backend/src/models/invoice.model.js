import prisma from '../config/db.js';

const invoiceInclude = {
  booking: {
    include: {
      user: {
        select: {
          user_id: true,
          email: true,
          full_name: true,
          phone: true,
          status: true,
          role: true,
        },
      },
      details: true,
      serviceUsages: true,
    },
  },
  details: true,
  payments: true,
};

export const findInvoices = ({ bookingId, status } = {}) => {
  return prisma.invoice.findMany({
    where: {
      ...(bookingId ? { booking_id: BigInt(bookingId) } : {}),
      ...(status ? { invoice_status: status } : {}),
    },
    include: invoiceInclude,
    orderBy: {
      invoice_id: 'desc',
    },
  });
};

export const findInvoiceById = (invoiceId) => {
  return prisma.invoice.findUnique({
    where: {
      invoice_id: BigInt(invoiceId),
    },
    include: invoiceInclude,
  });
};

export const createInvoiceRecord = (invoiceData, detailsData) => {
  return prisma.$transaction(async (tx) => {
    const invoice = await tx.invoice.create({
      data: invoiceData,
    });

    if (detailsData.length > 0) {
      await tx.invoiceDetail.createMany({
        data: detailsData.map((detail) => ({
          ...detail,
          invoice_id: invoice.invoice_id,
        })),
      });
    }

    return tx.invoice.findUnique({
      where: {
        invoice_id: invoice.invoice_id,
      },
      include: invoiceInclude,
    });
  });
};

export const updateInvoiceRecord = (invoiceId, data) => {
  return prisma.invoice.update({
    where: {
      invoice_id: BigInt(invoiceId),
    },
    data,
    include: invoiceInclude,
  });
};

export const deleteInvoiceRecord = (invoiceId) => {
  return prisma.invoice.delete({
    where: {
      invoice_id: BigInt(invoiceId),
    },
  });
};

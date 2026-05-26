import prisma from '../config/db.js';

const bookingInclude = {
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
  details: {
    include: {
      room: {
        include: {
          room_type: true,
        },
      },
    },
  },
  serviceUsages: {
    include: {
      service: true,
    },
  },
  invoices: true,
  checkins: true,
};

export const findBookings = ({ userId, status } = {}) => {
  return prisma.booking.findMany({
    where: {
      ...(userId ? { user_id: BigInt(userId) } : {}),
      ...(status ? { status } : {}),
    },
    include: bookingInclude,
    orderBy: {
      booking_id: 'desc',
    },
  });
};

export const findBookingById = (bookingId) => {
  return prisma.booking.findUnique({
    where: {
      booking_id: BigInt(bookingId),
    },
    include: bookingInclude,
  });
};

export const createBookingRecord = (bookingData, detailsData) => {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.create({
      data: bookingData,
    });

    if (detailsData.length > 0) {
      await tx.bookingDetail.createMany({
        data: detailsData.map((detail) => ({
          ...detail,
          booking_id: booking.booking_id,
        })),
      });
    }

    return tx.booking.findUnique({
      where: {
        booking_id: booking.booking_id,
      },
      include: bookingInclude,
    });
  });
};

export const updateBookingRecord = (bookingId, data) => {
  return prisma.booking.update({
    where: {
      booking_id: BigInt(bookingId),
    },
    data,
    include: bookingInclude,
  });
};

export const deleteBookingRecord = (bookingId) => {
  return prisma.booking.delete({
    where: {
      booking_id: BigInt(bookingId),
    },
  });
};

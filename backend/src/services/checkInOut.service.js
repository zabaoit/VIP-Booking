import { findBookingById } from '../models/booking.model.js';
import { findRoomById } from '../models/room.model.js';
import {
  createCheckInOutRecord,
  deleteCheckInOutRecord,
  findCheckInOutById,
  findCheckInOuts,
  updateCheckInOutRecord,
} from '../models/checkInOut.model.js';
import { createHttpError } from '../utils/response.js';

export const listCheckInOuts = (filters) => {
  return findCheckInOuts(filters);
};

export const getCheckInOut = async (checkInOutId) => {
  const checkInOut = await findCheckInOutById(checkInOutId);

  if (!checkInOut) {
    throw createHttpError(404, 'Không tìm thấy bản ghi check-in/check-out');
  }

  return checkInOut;
};

export const addCheckInOut = async (payload, actor) => {
  const booking = await findBookingById(payload.booking_id);

  if (!booking) {
    throw createHttpError(400, 'Đặt phòng không tồn tại');
  }

  const room = await findRoomById(payload.room_id);

  if (!room) {
    throw createHttpError(400, 'Phòng không tồn tại');
  }

  return createCheckInOutRecord({
    booking_id: BigInt(payload.booking_id),
    room_id: BigInt(payload.room_id),
    staff_id: BigInt(payload.staff_id || actor.id),
    check_in_time: payload.check_in_time ? new Date(payload.check_in_time) : new Date(),
    check_out_time: payload.check_out_time ? new Date(payload.check_out_time) : null,
    status: payload.status,
    note: payload.note || null,
  });
};

export const editCheckInOut = async (checkInOutId, payload) => {
  await getCheckInOut(checkInOutId);

  return updateCheckInOutRecord(checkInOutId, {
    ...(payload.room_id ? { room_id: BigInt(payload.room_id) } : {}),
    ...(payload.staff_id ? { staff_id: BigInt(payload.staff_id) } : {}),
    ...(payload.check_in_time ? { check_in_time: new Date(payload.check_in_time) } : {}),
    ...(payload.check_out_time ? { check_out_time: new Date(payload.check_out_time) } : {}),
    ...(payload.status ? { status: payload.status } : {}),
    ...(payload.note !== undefined ? { note: payload.note || null } : {}),
  });
};

export const removeCheckInOut = async (checkInOutId) => {
  await getCheckInOut(checkInOutId);
  await deleteCheckInOutRecord(checkInOutId);
};

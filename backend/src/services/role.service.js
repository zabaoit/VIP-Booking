import {
  createRoleRecord,
  deleteRoleRecord,
  findRoleById,
  findRoles,
  updateRoleRecord,
} from '../models/roleCrud.model.js';
import { createHttpError } from '../utils/response.js';

export const listRoles = () => {
  return findRoles();
};

export const getRole = async (roleId) => {
  const role = await findRoleById(roleId);

  if (!role) {
    throw createHttpError(404, 'Không tìm thấy vai trò');
  }

  return role;
};

export const addRole = (payload) => {
  return createRoleRecord(payload);
};

export const editRole = async (roleId, payload) => {
  await getRole(roleId);
  return updateRoleRecord(roleId, payload);
};

export const removeRole = async (roleId) => {
  const role = await getRole(roleId);

  if (role._count.users > 0) {
    throw createHttpError(409, 'Không thể xóa vai trò đang có người dùng');
  }

  await deleteRoleRecord(roleId);
};

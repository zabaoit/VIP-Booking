import { z } from 'zod';
import {
  addRole,
  editRole,
  getRole,
  listRoles,
  removeRole,
} from '../services/role.service.js';
import { handleControllerError, sendSuccess } from '../utils/response.js';

const idSchema = z.string().regex(/^\d+$/, 'ID không hợp lệ');
const roleSchema = z.object({
  role_name: z.string().trim().min(2, 'Tên vai trò phải có ít nhất 2 ký tự'),
  description: z.string().trim().optional().nullable(),
});
const updateRoleSchema = roleSchema.partial();

export const index = async (req, res) => {
  try {
    return sendSuccess(res, { data: { roles: await listRoles() } });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const show = async (req, res) => {
  try {
    const role = await getRole(idSchema.parse(req.params.id));
    return sendSuccess(res, { data: { role } });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const store = async (req, res) => {
  try {
    const role = await addRole(roleSchema.parse(req.body));
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Tạo vai trò thành công',
      data: { role },
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const update = async (req, res) => {
  try {
    const role = await editRole(idSchema.parse(req.params.id), updateRoleSchema.parse(req.body));
    return sendSuccess(res, {
      message: 'Cập nhật vai trò thành công',
      data: { role },
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const destroy = async (req, res) => {
  try {
    await removeRole(idSchema.parse(req.params.id));
    return sendSuccess(res, { message: 'Xóa vai trò thành công' });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

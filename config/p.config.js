const Ptype = require('../filters/permissionsType');
module.exports = {
  '/api/uploadImg': Ptype.USER,

  '/api/admin/article/page': Ptype.ADMIN,
  '/api/admin/article/getArticleById': Ptype.ADMIN,
  '/api/admin/article/deleteById': Ptype.ADMIN,
  '/api/admin/article/addAndUpdateById': Ptype.ADMIN,

  '/api/admin/comment/page': Ptype.ADMIN,
  '/api/admin/comment/deleteById': Ptype.ADMIN,
  '/api/admin/comment/auditCommentById': Ptype.ADMIN,

  '/api/admin/part': Ptype.ADMIN,
  '/api/admin/part/addAndUpdate': Ptype.ADMIN,
  '/api/admin/part/deleteById': Ptype.ADMIN,

  'api/admin/link': Ptype.ADMIN,
  '/api/admin/link/addAndUpdate': Ptype.ADMIN,
  '/api/admin/link/deleteById': Ptype.ADMIN,

  '/api/admin/user/setAdminById': Ptype.ADMIN,
  '/api/admin/user/getCurrentUser': Ptype.ADMIN,
  '/api/admin/user/deleteById': Ptype.ADMIN,
  '/api/admin/user/getUserById': Ptype.ADMIN,
  '/api/admin/user/updateSome': Ptype.ADMIN,

  // '/api/admin/login': Ptype.ADMIN, 不需要权限
  '/api/admin/logout': Ptype.ADMIN,
}
/**
 * Get Permissions
 * @access private
 * @param {string} [data]
 * @return {Object}
 */
export default function getPermissions(data = '') {
  const permissions = data.length ? data.toLowerCase() : data;
  return {
    canRead: permissions.includes('read') || permissions.includes('all'),
    canModify: permissions.includes('modify') || permissions.includes('all'),
    canUpdate: permissions.includes('update') || permissions.includes('modify') || permissions.includes('all'),
    canDelete: permissions.includes('delete') || permissions.includes('modify') || permissions.includes('all'),
    canChangePermission: permissions.includes('changePermission') || permissions.includes('all'),
  };
}

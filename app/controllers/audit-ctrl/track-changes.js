/**
 * Track the changes in the change list. The change list must be a list of
 * Sequelize instances that have yet to be saved. The delete list must be
 * a list of Sequelize instances that are intended for deletion, but have not
 * yet been deleted.
 *
 * @param {object} auditCtrl Instance of AuditCtrl
 * @param {string} auditApiCallUuid Audit API call
 * @param {object[]} [changeList] List of Sequelize instances to update
 * @param {object[]} [deleteList] List of Sequelize instances to destroy
 * @param {object[]} [newList] List of Sequelize instances that have been created
 * @param {object} transaction Sequelize transaction
 */
module.exports = async({
  auditCtrl,
  auditApiCallUuid,
  changeList = [],
  deleteList = [],
  newList = [],
  transaction,
}) => {
  const models = auditCtrl.models;
  if (!transaction) {
    throw new Error('Sequelize transaction is required.');
  } else if (!auditApiCallUuid) {
    throw new Error('API call is required.');
  }

  const auditLog = await models.Audit.Log.create({
    audit_api_call_uuid: auditApiCallUuid,
  }, {
    transaction,
  });

  const promises = [];
  for (const changeInstance of changeList) {
    promises.push(auditCtrl._trackInstanceUpdate(auditLog, changeInstance, transaction));
  }
  for (const deleteInstance of deleteList) {
    promises.push(auditCtrl._trackInstanceDestroy(auditLog, deleteInstance, transaction));
  }
  for (const newInstance of newList) {
    promises.push(auditCtrl._trackNewInstance(auditLog, newInstance, transaction));
  }

  await Promise.all(promises);
};

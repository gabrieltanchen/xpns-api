/**
* Save audit change for deletion of paranoid instances. Only delete instances
* that are paranoid.
*
* @param {object} auditCtrl Instance of AuditCtrl
* @param {object} auditLog Audit log Sequelize instance
* @param {object} instance The Sequelize instance to track
* @param {object} transaction Sequelize transaction
 */
module.exports = async({
  auditCtrl,
  auditLog,
  instance,
  transaction,
}) => {
  const models = auditCtrl.models;
  if (!auditLog) {
    throw new Error('Audit log is required.');
  } else if (!instance) {
    throw new Error('Sequelize instance is required.');
  } else if (!transaction) {
    throw new Error('Sequelize transaction is required.');
  }

  if (instance._modelOptions.paranoid) {
    // Only destroy paranoid models. Deleting non-paranoid models must be done
    // manually.
    await instance.destroy({
      transaction,
    });

    const tableName = instance._modelOptions.tableName;
    const primaryKey = auditCtrl.getPrimaryKey(tableName);
    await models.Audit.Change.create({
      attribute: 'deleted_at',
      audit_log_uuid: auditLog.get('uuid'),
      key: instance.get(primaryKey),
      new_value: String(instance.get('deleted_at')),
      table: tableName,
    }, {
      transaction,
    });
  }
};

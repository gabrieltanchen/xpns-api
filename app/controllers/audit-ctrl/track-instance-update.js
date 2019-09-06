const { AuditError } = require('../../middleware/error-handler/');

/**
 * Save audit changes for the changed attributes for this instance using
 * instance.changed().
 *
 * This method assumes that the instance has not yet been saved, thus
 * instance.changed() is not empty.
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
    throw new AuditError('Audit log is required');
  } else if (!instance) {
    throw new AuditError('Sequelize instance is required');
  } else if (!transaction) {
    throw new AuditError('Sequelize transaction is required');
  }

  const auditChanges = [];
  const changedAttributes = instance.changed() || [];

  const suppressLogChanges = auditCtrl.suppressLogChanges;
  const tableName = instance._modelOptions.tableName;
  const primaryKey = auditCtrl.getPrimaryKey(tableName);
  suppressLogChanges.push(primaryKey);

  for (const attr of changedAttributes) {
    if (!suppressLogChanges.includes(attr)) {
      auditChanges.push(models.Audit.Change.create({
        attribute: attr,
        audit_log_uuid: auditLog.get('uuid'),
        key: instance.get(primaryKey),
        new_value: String(instance.get(attr)),
        old_value: String(instance.previous(attr)),
        table: tableName,
      }, {
        transaction,
      }));
    }
  }

  auditChanges.push(instance.save({
    transaction,
  }));

  await Promise.all(auditChanges);
};

const { AuditError } = require('../../middleware/error-handler');

/**
 * Save audit changes for all attributes for this instance. Use
 * instance.dataValues to get the instance attributes rather than
 * instance.changed() because the latter will not contain any default values.
 *
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

  const suppressLogChanges = auditCtrl.suppressLogChanges;
  const tableName = models[instance.constructor.name].tableName;
  const primaryKey = auditCtrl.getPrimaryKey(tableName);
  suppressLogChanges.push(primaryKey);

  for (const attr of Object.keys(instance.dataValues)) {
    if (!suppressLogChanges.includes(attr)) {
      auditChanges.push(models.Audit.Change.create({
        attribute: attr,
        audit_log_uuid: auditLog.get('uuid'),
        key: instance.get(primaryKey),
        new_value: String(instance.get(attr)),
        table: tableName,
      }, {
        transaction,
      }));
    }
  }
  await Promise.all(auditChanges);
};

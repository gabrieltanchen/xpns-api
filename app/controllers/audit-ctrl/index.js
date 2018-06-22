class AuditCtrl {
  constructor(parent, models) {
    this.parent = parent;
    this.models = models;
  }

  /**
   * Save audit changes for all attributes for this instance. Use
   * instance.dataValues to get the instance attributes rather than
   * instance.changed() because the latter will not contain any default values.
   *
   * @param {object} auditLog Audit log Sequelize instance
   * @param {object} instance The Sequelize instance to track
   * @param {object} transaction Sequelize transaction
   */
  async _trackNewInstance(auditLog, instance, transaction) {
    const models = this.models;
    if (!auditLog) {
      throw new Error('Audit log is required.');
    } else if (!instance) {
      throw new Error('Sequelize instance is required.');
    } else if (!transaction) {
      throw new Error('Sequelize transaction is required.');
    }

    await instance.save({
      transaction,
    });

    const auditChanges = [];
    for (const attr of Object.keys(instance.dataValues)) {
      const suppressLogChanges = [
        'created_at',
        'deleted_at',
        'h1',
        'h2',
        's1',
        's2',
        'updated_at',
      ];
      let primaryKey;
      const tableName = instance._modelOptions.tableName;
      switch (tableName) {
      case 'user_logins':
        primaryKey = 'user_uuid';
        break;
      default:
        primaryKey = 'uuid';
      }
      suppressLogChanges.push(primaryKey);
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
  }
}

module.exports = AuditCtrl;

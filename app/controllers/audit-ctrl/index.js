class AuditCtrl {
  constructor(parent, models) {
    this.parent = parent;
    this.models = models;

    this.getPrimaryKey = (tableName) => {
      let primaryKey;
      switch (tableName) {
      case 'user_logins':
        primaryKey = 'user_uuid';
        break;
      default:
        primaryKey = 'uuid';
      }
      return primaryKey;
    };
    this.suppressLogChanges = [
      'created_at',
      'h1',
      'h2',
      's1',
      's2',
      'updated_at',
    ];
  }

  // Private methods

  /**
  * Save audit change for deletion of paranoid instances. Only delete instances
  * that are paranoid.
  *
  * @param {object} auditLog Audit log Sequelize instance
  * @param {object} instance The Sequelize instance to track
  * @param {object} transaction Sequelize transaction
   */
  async _trackInstanceDestroy(auditLog, instance, transaction) {
    const models = this.models;
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
      const primaryKey = this.getPrimaryKey(tableName);
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
  }

  /**
   * Save audit changes for the changed attributes for this instance using
   * instance.changed().
   *
   * This method assumes that the instance has not yet been saved, thus
   * instance.changed() is not empty.
   *
   * @param {object} auditLog Audit log Sequelize instance
   * @param {object} instance The Sequelize instance to track
   * @param {object} transaction Sequelize transaction
   */
  async _trackInstanceUpdate(auditLog, instance, transaction) {
    const models = this.models;
    if (!auditLog) {
      throw new Error('Audit log is required.');
    } else if (!instance) {
      throw new Error('Sequelize instance is required.');
    } else if (!transaction) {
      throw new Error('Sequelize transaction is required.');
    }

    const auditChanges = [];
    const changedAttributes = instance.changed() || [];

    const suppressLogChanges = this.suppressLogChanges;
    const tableName = instance._modelOptions.tableName;
    const primaryKey = this.getPrimaryKey(tableName);
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

    const suppressLogChanges = this.suppressLogChanges;
    const tableName = instance._modelOptions.tableName;
    const primaryKey = this.getPrimaryKey(tableName);
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
  }

  // Public methods

  /**
   * Track the changes in the change list. The change list must be a list of
   * Sequelize instances that have yet to be saved. The delete list must be
   * a list of Sequelize instances that are intended for deletion, but have not
   * yet been deleted.
   *
   * @param {string} auditApiCallUuid Audit API call
   * @param {object[]} [changeList] List of Sequelize instances to create/update
   * @param {object[]} [deleteList] List of Sequelize instances to destroy
   * @param {object} transaction Sequelize transaction
   */
  async trackChanges({
    auditApiCallUuid,
    changeList = [],
    deleteList = [],
    transaction,
  }) {
    const models = this.models;
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
      if (changeInstance.isNewRecord) {
        promises.push(this._trackNewInstance(auditLog, changeInstance, transaction));
      } else {
        promises.push(this._trackInstanceUpdate(auditLog, changeInstance, transaction));
      }
    }
    for (const deleteInstance of deleteList) {
      promises.push(this._trackInstanceDestroy(auditLog, deleteInstance, transaction));
    }

    await Promise.all(promises);
  }
}

module.exports = AuditCtrl;

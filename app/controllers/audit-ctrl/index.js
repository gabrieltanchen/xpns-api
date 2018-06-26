const trackChanges = require('./track-changes');
const trackInstanceDestroy = require('./track-instance-destroy');
const trackInstanceUpdate = require('./track-instance-update');
const trackNewInstance = require('./track-new-instance');

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
    return trackInstanceDestroy({
      auditCtrl: this,
      auditLog,
      instance,
      transaction,
    });
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
    return trackInstanceUpdate({
      auditCtrl: this,
      auditLog,
      instance,
      transaction,
    });
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
    return trackNewInstance({
      auditCtrl: this,
      auditLog,
      instance,
      transaction,
    });
  }

  // Public methods

  /**
   * Track the changes in the change list. The change list must be a list of
   * Sequelize instances that have yet to be saved. The delete list must be
   * a list of Sequelize instances that are intended for deletion, but have not
   * yet been deleted.
   *
   * @param {string} auditApiCallUuid Audit API call
   * @param {object[]} [changeList] List of Sequelize instances to update
   * @param {object[]} [deleteList] List of Sequelize instances to destroy
   * @param {object[]} [newList] List of Sequelize instances that have been created
   * @param {object} transaction Sequelize transaction
   */
  async trackChanges({
    auditApiCallUuid,
    changeList = [],
    deleteList = [],
    newList = [],
    transaction,
  }) {
    return trackChanges({
      auditCtrl: this,
      auditApiCallUuid,
      changeList,
      deleteList,
      newList,
      transaction,
    });
  }
}

module.exports = AuditCtrl;

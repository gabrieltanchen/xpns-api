const Sequelize = require('sequelize');

const { CategoryError } = require('../../../middleware/error-handler');

const Op = Sequelize.Op;

module.exports = (app) => {
  const models = app.get('models');

  /**
   * @api {get} /categories/:uuid
   * @apiName CategoryItemGet
   * @apiGroup Category
   *
   * @apiSuccess (200) {object} data
   * @apiSuccess (200) {object} data.attributes
   * @apiSuccess (200) {string} data.attributes[created-at]
   * @apiSuccess (200) {string} data.attributes.name
   * @apiSuccess (200) {string} data.id
   * @apiSuccess (200) {string} data.type
   *
   * @apiErrorExample {json} Error-Response:
   *    HTTP/1.1 401 Unprocessable Entity
   *    {
   *      "errors": [{
   *        "detail": "Unauthorized",
   *      }],
   *    }
   */
  return async(req, res, next) => {
    try {
      const user = await models.User.findOne({
        attributes: ['household_uuid', 'uuid'],
        where: {
          uuid: req.userUuid,
        },
      });
      if (!user) {
        throw new Error('Unauthorized');
      }

      const category = await models.Category.findOne({
        attributes: ['created_at', 'name', 'uuid'],
        include: [{
          attributes: ['uuid'],
          model: models.Subcategory,
          required: false,
        }],
        where: {
          household_uuid: user.get('household_uuid'),
          uuid: req.params.uuid,
        },
      });
      if (!category) {
        throw new CategoryError('Not found');
      }

      const subcategoryUuids = category.Subcategories.map((subcategory) => {
        return subcategory.get('uuid');
      });
      const subcategoryCount = await models.Subcategory.count({
        where: {
          category_uuid: category.get('uuid'),
        },
      });
      const expenseCount = await models.Expense.count({
        where: {
          subcategory_uuid: {
            [Op.in]: subcategoryUuids,
          },
        },
      });
      const sumAmountCents = await models.Expense.sum('amount_cents', {
        where: {
          subcategory_uuid: {
            [Op.in]: subcategoryUuids,
          },
        },
      });
      const sumReimbursedCents = await models.Expense.sum('reimbursed_cents', {
        where: {
          subcategory_uuid: {
            [Op.in]: subcategoryUuids,
          },
        },
      });

      return res.status(200).json({
        'data': {
          'attributes': {
            'created-at': category.get('created_at'),
            'expense-count': expenseCount || 0,
            'name': category.get('name'),
            'subcategory-count': subcategoryCount || 0,
            'sum-amount': sumAmountCents || 0,
            'sum-reimbursed': sumReimbursedCents || 0,
          },
          'id': category.get('uuid'),
          'type': 'categories',
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};

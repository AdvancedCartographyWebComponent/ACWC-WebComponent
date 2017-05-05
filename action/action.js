const actionTypes = require('../actiontype/actionType');

let actions = {
  click(id) {
    return {
      type: actionTypes.CLICK,
      id
    }
  },
  setLastChangeState(change) {
    return {
      type: actionTypes.SetLastChangeState,
      change
    }
  },
  updateTreeData(newdata) {
    return {
      type: actionTypes.UpdateTreeData,
      newdata
    }
  }
};

module.exports = actions;

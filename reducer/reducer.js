const actionTypes = require('../actiontype/actionType');
const defaultTreeData = {
  "Option 1" : {
    checked: false,
    checkbox: true,
    children: {
      "Sub Option 1" : {
        checked: false,
        checkbox: true,
      },
      "Sub Option 2" : {
        checked: false,
        checkbox: true,
        children: {
          "Sub-Sub Option 1" : {
            checked: false,
            checkbox: true
          },
          "Sub-Sub Option 2" : {
            checked: false,
            checkbox: true
          }
        }
      }
    }
  },
  "Option 2" : {
    checked: false,
    checkbox: true
  }
};
const initialState = {
  content: "hello",
  lastChange:null,
  treeData : null// Loads default language content (en) as an initial state
};

var reducer = function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.CLICK:
      console.log("click :",action.id);
      return Object.assign({}, state, {
        content: "lol"
      })
    case actionTypes.SetLastChangeState:
      console.log("State Now :",state.lastChange);
      console.log("SetLastChangeState :",action.change);
      return Object.assign({}, state, {
        lastChange:action.change
      })
    case actionTypes.UpdateTreeData:
      console.log("UpdateTreeData :",action.newdata);
      return Object.assign({}, state, {
        treeData:action.newdata
      })
    case actionTypes.UseDefaultData:
      console.log("UseDefaultData",defaultTreeData);
      return Object.assign({}, state, {
        treeData:defaultTreeData
      })
    default:
      return state;
  }
};

module.exports = reducer;

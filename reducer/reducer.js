const actionTypes = require('../actiontype/actionType');
const defaultTreeData = {"@graph":[]};//require('json!../data/test/World_Heritage_Sites.skos.jsonld');
//const defaultTreeData = require('json!../data/test/scooterTree.jsonld');
const defaultMapData = {"@graph":[]};//require('json!../data/test/exemple_villes.jsonld');
//const defaultMapData = require('json!../data/test/scooter2.jsonld');
const ScooterInfo = require('../Context/scooterInfo');
var jsonld = require('jsonld');
var _ = require('lodash');
var Immutable = require('immutable');
var flatten = function(data) {
      var result = {};
      function recurse (cur, prop) {
          if (Object(cur) !== cur) {
              result[prop] = cur;
          } else if (Array.isArray(cur)) {
               for(var i=0, l=cur.length; i<l; i++)
                   recurse(cur[i], prop ? prop+"."+i : ""+i);
              if (l == 0)
                  result[prop] = [];
          } else {
              var isEmpty = true;
              for (var p in cur) {
                  isEmpty = false;
                  recurse(cur[p], prop ? prop+"."+p : p);
              }
              if (isEmpty)
                  result[prop] = {};
          }
      }
      recurse(data, "");
      return result;
}
var treeConstructor = function (rawData,countList,root){
  if(!countList["Exclued Data"]||countList["Exclued Data"]==0){
    var tree ={};
  }else{
    var tree ={
      "Exclued Data":{
        checked: false,
        checkbox: false,
        collapsed:true,
        children:{},
        markerAndIcons:[],
        num:countList["Exclued Data"]
      }
    };
  }
  var treeData = buildTree(tree,root,rawData["@graph"],countList);
  for(var num in root){
    countParentsNum(treeData,(root[num]));
  }
  return treeData;
}
var treeNameMap = function(rawTreeData){
  var treeNameMap={};
  //console.log("treeNameMap",rawTreeData);
  rawTreeData["@graph"].map((value,index)=>{
    if(!treeNameMap[value["@id"]]&&value["@id"]&&value["skos:prefLabel"]){
      treeNameMap[value["@id"]]=value["skos:prefLabel"]
    }
  })
  //console.log("treeNameMap result",treeNameMap);
  return treeNameMap;
}
var markerAndIconsMap = function(rawTreeData){
  var markerAndIconsMapTemp={};
  //console.log("markerAndIconsMapTemp",rawTreeData);
  rawTreeData["@graph"].map((value,index)=>{
    if(!markerAndIconsMapTemp[value["@id"]]&&value["@id"]&&value["markerAndIcons"]){
      markerAndIconsMapTemp[value["@id"]]=value["markerAndIcons"]
    }
  })
  //console.log("markerAndIconsMap result",markerAndIconsMapTemp);
  return markerAndIconsMapTemp;
}
var buildTree = function(tree,parentId,rawData,countList){
  ////console.log("buildTree parentId",parentId);
  rawData.map((value)=>{
    var id = value["@id"]?value["@id"]:"Default ID";
    var broader = value["broader"]?value["broader"]:null;
    var name = value["prefLabel"]?value["prefLabel"]["@value"]:null;
    var language = value["prefLabel"]?value["prefLabel"]["@language"]:null;
    var markerAndIcons = value["markerAndIcons"]?value["markerAndIcons"]:null;//[{"icon":"motorcycle","color":"CADETBLUE","number":null}];
    if((typeof broader === 'object')&&broader){
      broader.map((value)=>{
        if (parentId.indexOf(value)!=-1) {
          if((value) in tree){
            tree[(value)]["children"][(id)] = {
              checked: false,
              checkbox: true,
              collapsed:true,
              children:{},
              markerAndIcons:markerAndIcons,
              num:countList[(id)]?countList[(id)]:0
            };
          }
          else{
            var child = {};
            child[(id)]= {
              checked: false,
              checkbox: true,
              collapsed:true,
              children:{},
              markerAndIcons:markerAndIcons,
              num:countList[(id)]?countList[(id)]:0
            };
            tree[(value)] = {
              checked: false,
              checkbox: true,
              collapsed:true,
              children:child,
              markerAndIcons:[],
              num:0
            };
          }
          buildTree(tree[(value)]["children"],[id],rawData);
        }
      })
    }
    else if(broader){
      if (parentId.indexOf(broader)!==-1) {
        if((broader) in tree){
          tree[(broader)]["children"][(id)] = {
            checked: false,
            checkbox: true,
            collapsed:true,
            children:{},
            markerAndIcons:markerAndIcons,
            num:countList[(id)]?countList[(id)]:0
          };
        }
        else{
          var child = {};
          child[(id)]= {
            checked: false,
            checkbox: true,
            collapsed:true,
            children:{},
            markerAndIcons:markerAndIcons,
            num:countList[(id)]?countList[(id)]:0
          };
          tree[(broader)]={
            checked: false,
            checkbox: true,
            collapsed:true,
            children:child,
            markerAndIcons:[],
            num:0
          };
        }
        buildTree(tree[(broader)]["children"],[id],rawData,countList);
      }
    }
  });
  ////console.log("buildTree tree",tree);
  return tree
}
var checkedItem = function(treeData,checkedList){
  for(var obj in treeData){
    if(_.size(treeData[obj]["children"])>0){
      treeData[obj]["checked"]&&checkedList.indexOf(obj)===-1?checkedList.push(obj):null;
      checkedItem(treeData[obj]["children"],checkedList);
    }
    else{
      treeData[obj]["checked"]&&checkedList.indexOf(obj)===-1?checkedList.push(obj):null;
    }
  }
  //console.log("checkedList",checkedList);
  return checkedList;
}
var countItem = function(geoData){
  var skosInContext = findSkosInContext(geoData["@context"]);
  if(_.size(geoData["@graph"])>0){
    var countList = geoData["@graph"].reduce(function (allNames, instance) {
      var skosInContent = findSkosInContent(instance,skosInContext);
      ////console.log("skosInContent",skosInContent);
      if (skosInContent&&skosInContent.length>=0) {
        for (var i = 0; i < skosInContent.length; i++) {
          if (skosInContent[i] in allNames) {
            allNames[skosInContent[i]]++;
          }
          else {
            allNames[skosInContent[i]] = 1;
          }
        }
      }
      return allNames;
    }, {});
  }else{
    var countList = {};
  }
  //console.log("countList",countList);
  return countList;
}
var findRoot = function(data,stateRoot){
  var flattenId = [];
  var flattenBroader = [];
  var tempRoot = [];
  data["@graph"].map((value)=>{
    var id = value["@id"];
    var broader;
    if(value["broader"]){
      broader = value["broader"];
    }else {
      tempRoot.push(value["@id"]);
    }
    if(typeof broader=="object"){
      for(var obj in broader){
        flattenBroader.indexOf(broader[obj])==-1?flattenBroader.push(broader[obj]):null;
      }
    }else {
      flattenBroader.indexOf(broader)==-1?flattenBroader.push(broader):null;
    }
    flattenId.indexOf(id)==-1?flattenId.push(id):null;

  })
  var root =tempRoot.length>0?tempRoot:_.difference(flattenBroader,flattenId);
  ////console.log("find root",root,flattenId,flattenBroader);
  return [root,flattenId,flattenBroader];

}
var countParentsNum = function(tree,parentId){
  if(tree[parentId]["children"]&&_.size(tree[parentId]["children"])>0){
    for(var obj in tree[parentId]["children"]){
      tree[parentId]["num"]=tree[parentId]["num"]+countParentsNum(tree[parentId]["children"],obj);
    }
    return tree[parentId]["num"]
  }
  else{
    return tree[parentId]["num"];
  }
}
var linkStringInLabel = function(labels){
  return labels;
}
var findSkosInContext = function(data){
  let skosList = [];
  let flattenContext = flatten(data);
  for (var i in flattenContext) {
    if(flattenContext[i]==="skos:Concept"){
      skosList.push(i.slice(0,i.length-4));
    }
  }
  return skosList;
}
var findSkosInContent = function(data,skosInContext){
  let skosList = [];
  let flattenContext = flatten(data);
  for (var i in flattenContext) {
    if(flattenContext[i]==="skos:Concept"){
      let temp = i.slice(0,i.length-5);
      temp = temp.concat("@id");
      skosList.push(data[temp]);
    }
  }
  for (var p = 0; p < skosInContext.length; p++) {
    let skosListTemp = data[skosInContext[p]];
    for (var m = 0; m < skosListTemp.length; m++) {
      skosList.push(skosListTemp[m]);
    }
  }
  return skosList;
}

var globalContentSearch = function(rawData,checkedItem,keyword,markerAndIconsMap){
  var geojson = {};
  var dataForTable = [];
  var skosInContext = findSkosInContext(rawData["@context"]);
  ////console.log("skosInContext",skosInContext);
  var geojsonForPath = {
  "type": "FeatureCollection",
  "features": []
  };
  var relatedRawData={
    "@context":rawData["@context"],
    "@graph":[]
  }
  var matchedRawData={
    "@context":rawData["@context"],
    "@graph":[]
  }
  var geoLine = {};
  var keyWordList = _.words(_.toLower(keyword),/\S*\w/g);
  rawData["@graph"].map((instance,index) =>{
    var skosInContent = findSkosInContent(instance,skosInContext);
    var markerAndIcons = instance["markerAndIcons"]?instance["markerAndIcons"]:null;
    if(markerAndIconsMap){
      for (var i in skosInContent) {
        let markerAndIconsMapTemp = markerAndIconsMap[skosInContent[i]]?markerAndIconsMap[skosInContent[i]]:[];
        for (var p= 0; p < markerAndIconsMapTemp.length; p++) {
          if(markerAndIcons){
            markerAndIcons.push(markerAndIconsMapTemp[p]);
          }
          else {
            markerAndIcons=[markerAndIconsMapTemp[p]];
          }
        }

      }
    }
    var lat = instance["lat"];
    var long = instance["long"];
    var propeties = instance;
    propeties["markerAndIcons"]=markerAndIcons;
    var related = false;
    var matched = false;
    var temp = (_.values(instance));
    ////console.log('globalContentSearch',temp);
    if(_.size(keyWordList)>0){
      for(var obj in temp){
        if(!related){
          if (typeof temp[obj] !== 'object'){
            for(var index in keyWordList){
              if(!related){
                if(_.toLower(temp[obj]).includes(keyWordList[index])){
                  related = true;
                  if(!checkedItem||checkedItem.length===0){
                    matched = true;
                  }
                  else if(skosInContent&&skosInContent.length>0){
                    for (var i = 0; i < skosInContent.length; i++) {
                      if(checkedItem.indexOf(skosInContent[i])>=0){
                        matched = true;
                        break;
                      }
                    }
                  }
                }
              }
            }
          }
          else{
              var value = (_.values(temp[obj]));
              for(var indexV in value){
                if(!related){
                  for(var indexK in keyWordList){
                    if(!related){
                      if(_.toLower(value[indexV]).includes(keyWordList[indexK])){
                        related = true;
                        if(!checkedItem||checkedItem.length==0){
                          matched = true;
                        }else if(skosInContent&&skosInContent.length>0){
                          for (var i = 0; i < skosInContent.length; i++) {
                            if(checkedItem.indexOf(skosInContent[i])>=0){
                              matched = true;
                              break;
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
        }
      }
    }
    else{
      related=true;
      if(!checkedItem||checkedItem.length==0){
          matched = true;
      }
      else if(skosInContent&&skosInContent.length>0){
        for (var i = 0; i < skosInContent.length; i++) {
          if(checkedItem.indexOf(skosInContent[i])>=0){
            matched = true;
            break;
          }
        }
      }
    }

    if(matched){
      var feature;
      feature =
      {
        "type": "Feature",
        "properties": propeties,
        "geometry": {
          "type": "Point",
          "coordinates": [long,lat]
        }
      };
      if(!geojson["features"]){
        geojson ={
          "type": "FeatureCollection",
          "features": []
        };
      }

      geojson["features"].push(feature);
      matchedRawData["@graph"].push(instance);
      dataForTable.push(feature.properties);
    }
    if(related){
      relatedRawData["@graph"].push(instance);
    }
  });
  //console.log("globalContentSearch",[geojson,matchedRawData,relatedRawData,geojsonForPath,dataForTable]);
  return [geojson,matchedRawData,relatedRawData,geojsonForPath,dataForTable];
}
var updateTreeNum = function(tree,countList){
  var temp ={};
  for(var obj in tree){
    temp[obj]={};
    for(var obj2 in tree[obj]){
      if(obj2=="children"){
        temp[obj][obj2]=_.size(tree[obj][obj2])>0?updateTreeNum(tree[obj][obj2],countList):{};
      }else if (obj2=="num") {
        temp[obj][obj2]=countList[obj]?countList[obj]:0;
      }else{
        temp[obj][obj2]=tree[obj][obj2];
      }
    }
  }
  return temp;
}
const defaultGeoJson = globalContentSearch(defaultMapData);
////console.log('reducer window',window.infoKeyForPanel);
const initialState = {
  content: "hello",
  lastChange:null,
  treeData : {},
  urlDataForMap :null,
  urlDataForTree :null,
  geoData : null,//defaultGeoJson[0],
  serverData:null,
  keyword : null,
  root : null,
  isInfo : false,
  isTable : false,
  tableData: null,//defaultGeoJson[4],
  Info : null,
  dynamicUrl : null,
  isTyping : false,
  geojsonForPath :defaultGeoJson[3],
  checkedItem : [],
  nameMap : {},
  tableType : 1,
  mapRef : null
};
var reducer = function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.CLICK:
      return Object.assign({}, state, {
        content: "lol"
      })
    case actionTypes.SetLastChangeState:
      return Object.assign({}, state, {
        lastChange:action.change
      })
    case actionTypes.UpdateTreeData:
      //console.log("UpdateTreeData :",action.newdata,action.typeAction);
      if(action.typeAction =="collapsed"){
        return Object.assign({}, state, {
          treeData:action.newdata,
        })
      }else if(action.typeAction =="checked"){
        var checkedlist=[];
        var tempCheckedItem = checkedItem(action.newdata,checkedlist);
        var findRootResults = findRoot(state.urlDataForTree?state.urlDataForTree:defaultTreeData,state.root);
        var globalContentSearchResult = globalContentSearch(state.urlDataForMap?state.urlDataForMap:defaultMapData,
          tempCheckedItem,state.keyword);
        return Object.assign({}, state, {
          treeData:action.newdata,
          geoData: globalContentSearchResult[0],
          root:findRootResults[0],
          checkedItem : tempCheckedItem,
          tableData : globalContentSearchResult[4]
        })
      }

    case actionTypes.UseDefaultTreeData :
      //console.log("UseDefaultTreeData");
      var findRootResults = findRoot(defaultTreeData,state.root);
      var defaultTree = treeConstructor(defaultTreeData,countItem(defaultMapData),findRootResults[0]);
      var nameMap = treeNameMap(defaultTreeData);
      return Object.assign({}, state, {
        treeData:defaultTree,
        root:findRootResults[0],
        nameMap : nameMap
      })
    case actionTypes.GetDataFromUrlForMap:
      //console.log("GetDataFromUrlForMap",action.urlDataForMap);
      var checkedlist=[];
      var markerAndIcons = markerAndIconsMap(state.urlDataForTree?state.urlDataForTree:defaultTreeData);
      var findRootResults = findRoot(state.urlDataForTree?state.urlDataForTree:defaultTreeData,state.root);
      var globalContentSearchResult = globalContentSearch(action.urlDataForMap,checkedItem(state.treeData,checkedlist),state.keyword,markerAndIcons);
      var nameMap = treeNameMap(state.urlDataForTree?state.urlDataForTree:defaultTreeData);
      return Object.assign({}, state, {
        urlDataForMap:action.urlDataForMap,
        treeData:treeConstructor(state.urlDataForTree?state.urlDataForTree:defaultTreeData,countItem(globalContentSearchResult[2]),findRootResults[0]),
        geoData:globalContentSearchResult[0],
        geojsonForPath : globalContentSearchResult[3],
        root:findRootResults[0],
        tableData : globalContentSearchResult[4],
        nameMap: nameMap
      })
    case actionTypes.GetDataFromUrlForTree:
      //console.log("GetDataFromUrlForTree",action.urlDataForTree);
      var checkedlist=[];
      var findRootResults = findRoot(action.urlDataForTree,state.root);
      var treeConstructorResult = treeConstructor(action.urlDataForTree,countItem(state.urlDataForMap?state.urlDataForMap:defaultMapData),findRootResults[0]);
      var nameMap = treeNameMap(action.urlDataForTree);
      return Object.assign({}, state, {
        urlDataForTree:action.urlDataForTree,
        treeData:treeConstructorResult,
        root:findRootResults[0],
        nameMap : nameMap
      })
    case actionTypes.GetDataFromUrlForTreeAndMap:
      //console.log("GetDataFromUrlForTreeAndMap",action.urlDataForTree,action.urlDataForMap);
      return Object.assign({}, state, {
        treeData:treeConstructor(action.urlDataForTree,countItem(action.urlDataForMap),state.root)
      })
    case actionTypes.UpdateServerData:
      return Object.assign({}, state, {
        serverData:action.serverData
      })
    case actionTypes.GlobalSearch:
      //console.log("GlobalSearch",action.keyword);
      var checkedlist=[];
      var tempCheckedItem = checkedItem(state.treeData,checkedlist);
      var globalContentSearchResult = globalContentSearch(state.urlDataForMap?state.urlDataForMap:defaultMapData,tempCheckedItem,action.keyword);
      var countItemResult = countItem(globalContentSearchResult[2]);//all matched points
      var updateTreeNumResult = updateTreeNum(state.treeData,countItemResult)
      for(var num in state.root){
        countParentsNum(updateTreeNumResult,(state.root[num]));
      }
      return Object.assign({}, state, {
        geoData:globalContentSearchResult[0],
        geojsonForPath : globalContentSearchResult[3],
        keyword:action.keyword,
        treeData:updateTreeNumResult,
        tableData:globalContentSearchResult[4]
      })
    case actionTypes.ClickMarker:
      //console.log("ClickMarker","marker",action.marker,"info",action.info);
      return Object.assign({}, state, {
        isInfo : true,
        Info : action.info
      })
    case actionTypes.CloseSideBar:
      //console.log("CloseSideBar");
      return Object.assign({}, state, {
        isInfo : false
      })
    case actionTypes.ReceiveGeoDataFromUrl:
      //console.log("ReceiveGeoDataFromUrl");
      return Object.assign({}, state, {
        geoData : action.geodata
      })
    case actionTypes.IsTyping:
      //console.log("isTyping",action.typing);
      return Object.assign({}, state, {
        isTyping : action.typing
      })
    case actionTypes.ToggleTable:
      //console.log("ToggleTable",action.isTable,action.tableType);
      return Object.assign({}, state, {
        isTable : action.isTable,
        tableType : action.tableType
      })
    case actionTypes.SendMapRef:
      //console.log("send map ref",action.mapRef);
      return Object.assign({}, state, {
        mapRef : action.mapRef
      })
    default:
      return state;
  }
};

module.exports = reducer;

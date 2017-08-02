# ACWC-Tree
# Demo
Find the live demo [here](https://advancedcartographywebcomponent.github.io/ACWC-Tree/)
# specification
specification fonctionnelle
https://docs.google.com/document/d/1GspWIZkBGzxHU_LtTYtv4HsamsKYgjFfydVKdPU8GUU/edit?usp=sharing

# Instruction
To start, install npm and then run the following two commands:
```
npm install

npm start
```
# Build guide
Assuming that you have already install the dependencies by **npm install**, or you should run it before build.
```
npm run build
```
Then:
  1. Find the index.html in the folder **build**, 
  2. Find the href of the generated js and css in the html file,
  3. Delete the first "/" in the href.

# Get data from URL (2 Ways)
## Way 1
Add ?params=**QueryString** after the url. For example:  
```
http://localhost:3000/?params=%7B%22infoKeyForTable%22%3A%5B%7B%22key%22%3A%22Subject%22%2C%22displayValue%22%3A%22Subject%22%7D%2C%7B%22key%22%3A%22Name%22%2C%22displayValue%22%3A%22Name%22%7D%2C%7B%22key%22%3A%22markerAndIcons%22%2C%22displayValue%22%3A%22Icons%22%7D%5D%2C%22infoKeyForPanel%22%3A%5B%7B%22key%22%3A%22Subject%22%2C%22displayValue%22%3A%22Subject%22%7D%2C%7B%22key%22%3A%22Abstract%22%2C%22displayValue%22%3A%22Abstract%22%7D%2C%7B%22key%22%3A%22Name%22%2C%22displayValue%22%3A%22Name%22%7D%5D%2C%22mapContext%22%3A%7B%22center%22%3A%5B48.836703%2C2.334345%5D%2C%22zoom%22%3A6%7D%2C%22mapDataUrl%22%3A%22https%3A%2F%2Fsementicbus-simonzen.rhcloud.com%2Fdata%2Fapi%2FPlateformeWebAlternativeACWC%22%2C%22treeDataUrl%22%3A%22https%3A%2F%2Fsemanticbus.cleverapps.io%2Fdata%2Fapi%2FTaxonomiePWA%22%7D
```
In order to Generate the proper **QueryString**, you can follow the command below:  
```
var params = {
          "infoKeyForTable":[
            {"key":"Subject","displayValue":"Subject"},
            {"key":"Name","displayValue":"Name"},
            {"key":"markerAndIcons","displayValue":"Icons"}
          ],
          "infoKeyForPanel":[
            {"key":"Subject","displayValue":"Subject"},
            {"key":"Abstract","displayValue":"Abstract"},
            {"key":"Name","displayValue":"Name"},

          ],
          "mapContext": {
            "center":[48.836703,2.334345],
            "zoom": 6
          },
          "mapDataUrl":"https://sementicbus-simonzen.rhcloud.com/data/api/PlateformeWebAlternativeACWC",
          "treeDataUrl" : "https://semanticbus.cleverapps.io/data/api/TaxonomiePWA"
        };
var QueryString = encodeURIComponent(JSON.stringify(params))
```  
**params** have 5 properties:   
infoKeyForTable    
infoKeyForPanel    
mapContext   
mapDataUrl    
treeDataUrl    
 
### Set Map Context and information displayed on the panel and table
```javascript
  var mapContext = {
        "center":[48.836703,2.334345],
        "zoom": 6
      };
```
**center** is the default center of map  
**zoom** is the default zoom of map  
```javascript
var infoKeyForTable=[
    {key:'Subject',displayValue:'Subject'},
    {key:'Name',displayValue:'Name'}
    ];
```
**key** is the data field(column) of the database  
**displayValue** is the value you want to display in the table or panel.  

```javascript
  var infoKeyForPanel=[
    {key:'Subject',displayValue:'Subject'},
    {key:'Name',displayValue:'Name'},
    {key:'Abstract',displayValue:'Abstract'}
    ];
```
**key** is the data field(column) of the database  
**displayValue** is the value you want to display in the table or panel.  

## Way 2 
**Import**: All the request should be loaded over https.

There are two global variables for configure the data.
You can reset the value of **window.treeDataUrl** to be the url for tree-menu with the prefix **?sko=**, for example:
```javascript
window.treeDataUrl = "https://api.myjson.com/bins/p9ytt"
```
And you can do the same thing with **window.mapDataUrl** to set the map data with the prefix **?geo=**.

Also, you can do the same thing with **window.geojsonUrl** to set the map data with the prefix **?geo=**. **Important**:It can not work with the tree-menu and the url should contain the [geojson](http://geojson.org/) data.

```javascript
window.treeDataUrl = "https://sementicbus-simonzen.rhcloud.com/data/api/AlternatibaMartigue"
```


In this case, we use semantic form to query and structure geo-location data.
See more info of semantic forms [**here**](semantic-forms.cc:9111/tools)

The tree data should follow the structure like this:
```json
{
  "@context": {
    "broader": {
      "@id": "skos:broader",
      "@type": "@id"
    },
    "skos": "http://www.w3.org/2004/02/skos/core#"
  },
  "@graph": [
    {
      "@type": "skos:Concept",
      "@id": "http://PWA/SKOS/domaine",
      "skos:prefLabel": "domaine"
    },
    {
      "@type": "skos:Concept",
      "@id": "http://PWA/SKOS/0dechet",
      "broader": "http://PWA/SKOS/domaine",
      "skos:prefLabel": "fabriquer, réparer, zéro déchets"
    },
    {
      "@type": "skos:Concept",
      "@id": "http://PWA/SKOS/ressourcerie",
      "broader": "http://PWA/SKOS/0dechet",
      "skos:prefLabel": "ressourceries"
    }
  ]
}

```
**"broader"** is the parent of **"@id"**  
**"skos:prefLabel"** is the name of the **Child**
So the structure will be like the following graph if you have plusieur records.<br />
**"broader"**<br />
 -**"@id"**<br />
 -**"@id"**<br />
 -**"@id"**<br />


The geolocation data should follow the structure like this:

```json
{
  "@context": {
    "subject": {
      "@id": "http://purl.org/dc/terms/subject",
      "@type": "@id"
    },
    "long": {
      "@id": "http://www.w3.org/2003/01/geo/wgs84_pos#long",
      "@type": "http://www.w3.org/2001/XMLSchema#float"
    },
    "lat": {
      "@id": "http://www.w3.org/2003/01/geo/wgs84_pos#lat",
      "@type": "http://www.w3.org/2001/XMLSchema#float"
    },
    "label": {
      "@id": "http://www.w3.org/2000/01/rdf-schema#label"
    },
    "geo": "http://www.w3.org/2003/01/geo/wgs84_pos#",
    "dbo": "http://dbpedia.org/ontology/",
    "dct": "http://purl.org/dc/terms/",
    "dbc": "http://dbpedia.org/resource/Category:",
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "dbr": "http://dbpedia.org/resource/",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "skos": "http://www.w3.org/2004/02/skos/core#"
  },
  "@graph": [
    {
      "subject": "Economie démocratique",
      "@graph": [
        {
          "@type": "skos:Concept",
          "@id": "http://PWA/SKOS/Economie démocratique"
        }
      ],
      "long": -1.184316,
      "lat": 47.365373,
      "label": {
        "@language": "fr",
        "@value": "ACIPA"
      },
      "@type": "dbo:PopulatedPlace",
      "@id": "http://PWA/POI/ACIPA"
    }
  ]
}
```  
**"@graph"** shows the links between the datas  
--**"@id"** is the name of the type    
--**"@type"** is the type of the semantique link    
**"subject"** is the parent of the poi, it works like the external key, linking to the **"@id"** in tree-menu  
**"markerAndIcons"** is the icons' configuration for markers, you can set the icons inside the markers, maximum 1 anchor marker and 6 surrounding markers.   
	**icon** is the icon style, you can use fontawesome's icon. If you want to add number, you should set it as   
	```	
	icon:"number"   
	```
	and then add number in **number**  
	```
	number:6  
	```
	**color** is the color setting.  
**"label"** is the name of poi    
**"lat"**,**"long"** is latitude and longitude of the poi        
**"@id"** is the name of the semantique link    
**"@type"** is the type of the POI  


# TODO
Change markers style using following plugin:

https://github.com/lvoogdt/Leaflet.awesome-markers



# Données

- Villes Européennes avec coordonnées géo., libellé, et catégories (cities with coordinates & label)
- catégories (skos:Consept) en dessous de dbc:World_Heritage_Sites_in_Europe


# Requêtes
For endpoint (server) : http://dbpedia.org/sparql
On peut utiliser l'IHM  http://dbpedia.org/sparql
ou (mieux) le requêteur 
http://yasgui.org/

- exemple_villes.sparql
- World_Heritage_Sites.skos.sparql

# Générer des JSON-LD à partir des Turtle
Télécharger Jena depuis https://jena.apache.org/download/index.cgi

```shell
cd ~/src/geo-map-component/data
~/apps/apache-jena-3.3.0/bin/riot --output=json-ld ~/src/geo-map-component/data/exemple_villes.ttl > \
                                                   ~/src/geo-map-component/data/exemple_villes.jsonld 
~/apps/apache-jena-3.3.0/bin/riot --output=json-ld ~/src/geo-map-component/data/World_Heritage_Sites.skos.ttl >  \
                                                   ~/src/geo-map-component/data/World_Heritage_Sites.skos.jsonld
```

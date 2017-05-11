# ACWC-WebComponent

specification fonctionnelle
https://docs.google.com/document/d/1GspWIZkBGzxHU_LtTYtv4HsamsKYgjFfydVKdPU8GUU/edit?usp=sharing

# Instruction
To start, install npm and then run the following two commands:

npm install

npm start

# Build guide
npm run build

Find the index.html in the dossier build, change the href of the generated js and css in the html file:
delete the first "/" in the href.

# get geo data from url
add ?url=<your geojson data address here>  after the url
e.g. http://localhost:3000/?url=https://api.myjson.com/bins/8sfgt

I already uploaded [a simple geojson](https://api.myjson.com/bins/8sfgt), so you can test if with the given link. Also you can upload your own and test it.
Info for [geojson format](https://geojson.org/)

# get geo data from sparql query(not ready yet)
We can use spqrql to get some geolocation info from dbpedia by adding the following [links](https://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=SELECT+%3FLON+%3FLAT+%3FLAB%0D%0AWHERE+%7B%0D%0A++GRAPH+%3FGRAPH+%7B%0D%0A++++%3Fsub+a+dbo%3APlace+.%0D%0A++++%3Fsub+geo%3Along+%3FLON+.%0D%0A++++%3Fsub+geo%3Alat+%3FLAT+.%0D%0A++++%3Fsub+rdfs%3Alabel+%3FLAB.%0D%0A++++filter%28+lang%28%3FLAB%29+%3D+%27fr%27+%29%0D%0A++%7D%0D%0A%7DLIMIT+100&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on
) to the end of the query url

http://localhost:3000/?sql=

For more info for generate sparql, check [here](https://dbpedia.org/sparql) and change the result format to json



# Demo
Find the live demo [here](https://advancedcartographywebcomponent.github.io/ACWC-WebComponent/)

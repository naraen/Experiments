# extract latest version of Swagger url from apis.guru

#curl -X GET "https://api.apis.guru/v2/list.json" -H "accept: application/json; charset=utf-8" -o swaggerList.json

jq '[. | to_entries | .[] | { provider : .key, url : (.value | .versions | to_entries | .[0] | .value.swaggerUrl )}] ' swaggerList.json  > swaggerUrlList.txt


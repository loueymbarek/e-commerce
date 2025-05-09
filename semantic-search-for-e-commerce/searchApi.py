from flask import Flask, request, jsonify
from elasticsearch import Elasticsearch
from sentence_transformers import SentenceTransformer
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
try:
    es = Elasticsearch(
        "https://e-commerce-elastic-search-d932b1.es.us-east-1.aws.elastic.cloud:443",
        api_key="RmlEZ3E1WUJhWlNpbm9GbWRQamo6NnpHdklxeHJCY0tMaEhXVmh4QkNnQQ=="
    )
except Exception as e:
    print("Connection Error:", e)

if es.ping():
    print("Succesfully connected to ElasticSearch!!")
else:
    print("Oops!! Can not connect to Elasticsearch!")
def extract_products(results):
    products = []
    for hit in results:
        product = {
            "company": hit["_source"]["company"],
            "category": hit["_source"]["category"],
            "colour": hit["_source"]["colour"],
            "description": hit["_source"]["description"],
            "image": hit["_source"]["image"],
            "name": hit["_source"]["name"],
            "product_url": hit["_source"]["product_url"],
            "price": hit["_source"]["price"]
        }
        products.append(product)
    
    return {"products": products}
 
    
    
def search(input_keyword):
    model = SentenceTransformer('all-mpnet-base-v2')
    vector_of_input_keyword = model.encode(input_keyword)

    query = {
        "field": "DescriptionVector",
        "query_vector": vector_of_input_keyword,
        "k": 10,
        "num_candidates": 1799
    }
    res = es.knn_search(
        index="jewlery-ecom", 
        knn=query , 
        source=["name","product_url","description","company","image", "price", "category", "colour"]
        )

    results = res["hits"]["hits"]

    return extract_products(results)



@app.route('/search', methods=['POST'])
def search_endpoint():
    data = request.json

    query_text = data.get('queryText')

    # Call your search function with the query text
    results = search(query_text)

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
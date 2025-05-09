indexMapping = {
    "properties":{
        "product_url":{
            "type":"text"
        },
        "product_name":{
            "type":"text"
        },
        "brand":{
            "type":"text"
        },
        "image_url":{
            "type":"text"
        },
        "sale_price":{
            "type":"long"
        },
        "category":{
            "type":"text"
        },
        "Description":{
            "type":"text"
        },
        "colour":{
            "type":"text"
        },
        "DescriptionVector":{
            "type":"dense_vector",
            "dims": 768,
            "index":True, 
            "similarity": "l2_norm"
        }

    }
}

# "index":True, means searchable 
#  "similarity": "l2_norm" similarity metric : eg cosine similarity this case eucledian distance


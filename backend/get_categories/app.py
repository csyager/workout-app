import json
import os
import boto3

table_name = os.environ['TABLE_NAME']
dynamodb = boto3.client("dynamodb")

def lambda_handler(event, context):

    entries = dynamodb.scan(
        TableName=table_name
    )

    categories = []
    for elem in entries["Items"]:
        categories.append(elem["Name"]["S"])

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with",
            "Access-Control-Allow-Origin": "*", 
            "Access-Control-Allow-Methods": "GET"
        },
        "body": json.dumps({
            "categories": categories
        })
    }

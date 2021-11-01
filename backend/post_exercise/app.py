import json
import os
import boto3

table_name = os.environ['TABLE_NAME']
categories_table_name = os.environ['CATEGORIES_TABLE_NAME']
dynamodb = boto3.client("dynamodb")

def lambda_handler(event, context):
    body = json.loads(event["body"])

    try:
        name = body["name"]
        category = body["category"]
    except KeyError:
        return {
            "statusCode": 400,
            "headers": {
                "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with",
                "Access-Control-Allow-Origin": "*", 
                "Access-Control-Allow-Methods": "POST"
            },
            "body": json.dumps({
                "message": "name and category fields are required"
            })
        }
    category_table_response = dynamodb.get_item(
        TableName=categories_table_name,
        Key={
            'Name': {
                'S': category
            }
        }
    )
    if "Item" not in category_table_response.keys():
        dynamodb.put_item(
            TableName=categories_table_name,
            Item={
                'Name': {
                    'S': category
                }
            }
        )
    
    response = dynamodb.put_item(
        TableName=table_name,
        Item={
            'Name': { 'S': name },
            'Category': { 'S': category }
        }
    )

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with",
            "Access-Control-Allow-Origin": "*", 
            "Access-Control-Allow-Methods": "POST"
        },
        "body": json.dumps({
            "response": response
        })
    }

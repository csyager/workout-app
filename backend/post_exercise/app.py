import json
import os
import boto3

table_name = os.environ['TABLE_NAME']
dynamodb = boto3.client("dynamodb")

def lambda_handler(event, context):

    name = json.loads(event["body"])["name"]
    
    response = dynamodb.put_item(
        TableName=table_name,
        Item={
            'Name': { 'S': name }
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

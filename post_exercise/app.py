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
        "body": json.dumps({
            "response": response
        })
    }

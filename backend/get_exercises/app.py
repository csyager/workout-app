import json
import os
import boto3

table_name = os.environ['TABLE_NAME']
dynamodb = boto3.client("dynamodb")

def lambda_handler(event, context):

    entries = dynamodb.scan(
        TableName=table_name
    )

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": entries
        })
    }

import json
import os
import boto3

table_name = os.environ["TABLE_NAME"]
index_name = os.environ['INDEX_NAME']
dynamodb = boto3.client("dynamodb")

def lambda_handler(event, context):
    queryStringParams = event["queryStringParameters"]
    pathParams = event["pathParameters"]

    exercise_name = pathParams["exercise_name"]
    try:
        limit = queryStringParams["limit"]
        entries = dynamodb.query(
            IndexName=index_name,
            TableName=table_name,
            KeyConditionExpression='Exercise = :e',
            Limit=int(limit),
            ScanIndexForward=True,
            ExpressionAttributeValues={
                ':e': {'S': exercise_name}
            }
        )
    except (TypeError, KeyError):
        return {
            "statusCode": 400,
            "headers": {
                "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with",
                "Access-Control-Allow-Origin": "*", 
                "Access-Control-Allow-Methods": "GET"
            },
            "body": json.dumps({
                "message": "limit query string parameter is required"
            })
        }

    sets = []
    for elem in entries["Items"]:
        set_obj = {
            "Exercise": elem["Exercise"]["S"],
            "SetDate": elem["SetDate"]["S"],
            "SetNumber": elem["SetNumber"]["N"],
            "Metric": elem["Metric"]["S"],
            "MetricAmount": elem["MetricAmount"]["N"],
            "Reps": elem["Reps"]["N"]
        }
        sets.append(set_obj)

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with",
            "Access-Control-Allow-Origin": "*", 
            "Access-Control-Allow-Methods": "GET"
        },
        "body": json.dumps({
            "sets": sets
        })
    }

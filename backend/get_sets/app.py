import json
import os
import boto3
import datetime
from zoneinfo import ZoneInfo

table_name = os.environ['TABLE_NAME']
dynamodb = boto3.client("dynamodb")

def lambda_handler(event, context):

    queryStringParams = event["queryStringParameters"]
    try:
        date = queryStringParams["date"]
    except:
        date = str(datetime.datetime.now(ZoneInfo("America/New_York")).date())

    entries = dynamodb.query(
        TableName=table_name,
        ScanIndexForward=True,
        KeyConditionExpression='SetDate = :d',
        ExpressionAttributeValues={
            ':d': {'S': date}
        }
    )
    
    response_body = {}
    for elem in entries["Items"]:
        exercise_name = elem["Exercise"]["S"]
        if exercise_name not in response_body.keys():
            response_body[exercise_name] = []
        
        response_body[exercise_name].append({
            "SetNumber": elem["SetNumber"]["N"],
            "Metric": elem["Metric"]["S"],
            "MetricAmount": elem["MetricAmount"]["S"],
            "Reps": elem["Reps"]["N"]
        })

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with",
            "Access-Control-Allow-Origin": "*", 
            "Access-Control-Allow-Methods": "GET"
        },
        "body": json.dumps(response_body)
    }

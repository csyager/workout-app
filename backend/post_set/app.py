import json
import os
import boto3
import datetime
import uuid

table_name = os.environ['TABLE_NAME']
dynamodb = boto3.client("dynamodb")

def lambda_handler(event, context):

    body = json.loads(event["body"])

    try:
        date = body["date"]
    except KeyError:
        date = str(datetime.date.today())
    exercise_name = body["exercise_name"]
    try:
        set_number = body["set_number"]
    except KeyError:
        set_number = str(0)
    category = body["category"]
    metric = body["metric"]
    metric_amount = body["metric_amount"]
    try:
        reps = body["reps"]
    except KeyError:
        reps = str(0)
    
    response = dynamodb.put_item(
        TableName=table_name,
        Item={
            'SetDate': { 'S': date },
            'Exercise-SetNum-Key': { 'S': f"{exercise_name}-{set_number}"},
            'Exercise': { 'S': exercise_name },
            'SetNumber': { 'N': set_number },
            'Category': { 'S': category },
            'Metric': { 'S': metric },
            'MetricAmount': { 'N': metric_amount },
            'Reps': { 'N': reps }
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

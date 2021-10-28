import json
import os
import boto3
import datetime

table_name = os.environ['TABLE_NAME']
dynamodb = boto3.client("dynamodb")

def lambda_handler(event, context):

    body = json.loads(event["body"])

    exercise_name = body["exercise_name"]
    try:
        set_number = body["set_number"]
    except KeyError:
        set_number = str(0)
    metric = body["metric"]
    metric_amount = body["metric_amount"]
    try:
        reps = body["reps"]
    except KeyError:
        reps = str(0)
    
    response = dynamodb.put_item(
        TableName=table_name,
        Item={
            'Datetime': { 'S': datetime.datetime.now().isoformat() },
            'Exercise': { 'S': exercise_name },
            'SetNumber': { 'N': set_number },
            'Metric': { 'S': metric },
            'MetricAmount': { 'N': metric_amount },
            'Reps': { 'N': reps }
        }
    )

    return {
        "statusCode": 200,
        "body": json.dumps({
            "response": response
        })
    }

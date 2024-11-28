import { DynamoDB } from "aws-sdk"

const dynamoDBClient = new DynamoDB.DocumentClient({
  region: "us-east-1",
})

export default dynamoDBClient

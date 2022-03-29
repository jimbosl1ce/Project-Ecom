const aws = require('aws-sdk');
const dotenv = require('dotenv').config();

const region = "us-east-1";
const bucketName = "push2production1337";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4'
});

// docs for getSignedUrlPromise

// Here, we retrieve a "signed" url from AWS for us to send our image to:

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getSignedUrlPromise-property

function generateUploadURL() {
  const imageName = "image_number_" + Math.random() * 1000;

  const params = ({
    Bucket: bucketName,
    Key: imageName,
    Expires: 60
  });

  return s3.getSignedUrlPromise('putObject', params);
}

module.exports = generateUploadURL;



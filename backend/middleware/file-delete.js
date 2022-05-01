const AWS = require("aws-sdk");

var s3 = new AWS.S3({
  accessKeyId: process.env.BUCKETEER_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.BUCKETEER_AWS_SECRET_ACCESS_KEY,
  region: "us-east-1",
});

const fileDelete = async (imagePath) => {
  const filename = imagePath.split("/").pop();
  const params = { Bucket: process.env.BUCKETEER_BUCKET_NAME, Key: filename };

  s3.headObject(params)
    .promise()
    .then(
      (data) => {
        console.log("File Found in S3");
        s3.deleteObject(params)
          .promise()
          .then(
            () => console.log("file deleted Successfully"),
            //prettier-ignore
            () => console.log('ERROR in file Deleting :' + JSON.stringify(err))
          );
      },
      (err) => console.log("File not Found ERROR : " + err.code)
    );
};

module.exports = fileDelete;

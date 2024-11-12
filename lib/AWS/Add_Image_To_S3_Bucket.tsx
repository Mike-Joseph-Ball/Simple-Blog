import {
    S3Client,
    PutObjectCommand,
    //CreateBucketCommand,
    //DeleteObjectCommand,
    //DeleteBucketCommand,
    //paginateListObjectsV2,
    //GetObjectCommand,
  } from "@aws-sdk/client-s3";


async function Add_Image_To_S3_Bucket(file:Buffer){
    console.log(".env vars: ",process.env)
    console.log("region: ",process.env.AWS_REGION)
    console.log("accessKeyId: ",process.env.AWS_ACCESS_KEY)
    console.log("secretAccessKey: ",process.env.AWS_SECRET_KEY)

    const s3Client = new S3Client({
        region: `${process.env.AWS_REGION}`, // Your AWS region
        credentials: {
          accessKeyId: `${process.env.AWS_ACCESS_KEY}`, // Replace with your access key
          secretAccessKey: `${process.env.AWS_SECRET_KEY}`, // Replace with your secret key
        },
      });

    // Put an object into an Amazon S3 bucket.
    const result = await s3Client.send(
        new PutObjectCommand({
            Bucket: 'simplebloglivebucket',
            Key: "my-first-object.txt",
            Body: file,
        }),
  );

  return result;

  }

export default Add_Image_To_S3_Bucket
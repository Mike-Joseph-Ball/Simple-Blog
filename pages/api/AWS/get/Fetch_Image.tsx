import { createInterface } from "node:readline/promises";

import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
  paginateListObjectsV2,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

import { NextApiRequest, NextApiResponse } from "next";

async function Get_Image_From_S3_Bucket(s3Client:S3Client,bucketName:string) {
    // Read the object.
  const { Body } = await s3Client.send(
    new GetObjectCommand({
      Bucket: bucketName,
      Key: "my-first-object.txt",
    }),
  );
}

const Fetch_Image = (req: NextApiRequest, res: NextApiResponse) => {
    const s3Client = new S3Client({});
    //This endpoint does not check for user auth. Makes it easier to editorhs implementation.
    //If time, general rate-limiting depending on source would be ideal

    //This API request recieves just the image name, which is a unique identifier.
    //The endpoint already knows the name of the S3 bucket. It retrieves the image from the S3 bucket, as 
    return (  );
}
 
export default Fetch_Image;
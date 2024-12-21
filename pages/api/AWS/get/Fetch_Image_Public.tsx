
import {
  S3Client,
  /*PutObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
  paginateListObjectsV2,*/
  GetObjectCommand,
} from "@aws-sdk/client-s3";

import { NextApiRequest, NextApiResponse } from "next";

async function Get_Image_From_S3_Bucket(s3Client:S3Client,bucketName:string,key:string) {


  // Read the object.
  const { Body } = await s3Client.send(
    new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    }),
  );

  return Body
}

const Fetch_Image = async (req: NextApiRequest, res: NextApiResponse) => {
    const s3Client = new S3Client({});
    if(req.method !== 'GET') {
      return res.status(405).json({error:'Method not allowed'})
    }

    const { imageId } = req.query;

    if(!imageId || typeof imageId !== 'string') {
      return res.status(400).json({error:'Image Id is required!'})
    }

    const imageResult = await Get_Image_From_S3_Bucket(s3Client,'simplebloglivebucket',imageId)
    //This endpoint does not check for user auth. Makes it easier to editorhs implementation.
    //If time, general rate-limiting depending on source would be ideal

    //This API request recieves just the image name, which is a unique identifier.
    //The endpoint already knows the name of the S3 bucket. It retrieves the image from the S3 bucket, as 
    return (imageResult);
}
 
export default Fetch_Image;
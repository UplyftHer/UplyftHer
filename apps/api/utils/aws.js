async function getSignedUrl(keys) {
    return new Promise((resolve, reject) => {


        let params = { Bucket: S3_BUCKET_NAME, Key: keys };
        s3.getSignedUrl('getObject', params, (err, url) => {
            if (err) reject(err);
            resolve(url);
        });
    });
}
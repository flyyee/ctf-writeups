// Imports the Google Cloud client library.
const { Storage } = require('@google-cloud/storage');
const fs = require("fs")

// Instantiates a client. Explicitly use service account credentials by
// specifying the private key file. All clients in google-cloud-node have this
// helper, see https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/docs/authentication.md
const projectId = 'whitehacks-csg-2021'
const keyFilename = 'creds.json'
const storage = new Storage({ projectId, keyFilename });

// storage.getFiles
// (err, files, nextQuery, apiResponse)

// Makes an authenticated API request.

fred = storage.bucket("fred_chkn").getFiles((err, files, nextQuery, apiResponse) => {
    console.log(files)
    storage.bucket("fred_chkn").file("secret.txt").createReadStream()
        .on('error', function (err) { })
        .on('response', function (response) {
            // Server connected and responded with the specified status and headers.
        })
        .on('end', function () {
            // The file is fully downloaded.
        })
        .pipe(fs.createWriteStream("log.txt"));
})

async function listBuckets() {
    try {
        const [buckets] = await storage.getBuckets();

        console.log('Buckets:');
        buckets.forEach(bucket => {
            console.log(bucket.name);
        });
    } catch (err) {
        console.error('ERROR:', err);
    }
}
listBuckets();
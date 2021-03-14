const { Storage } = require('@google-cloud/storage');
const fs = require("fs")

const projectId = 'whitehacks-csg-2021'
const keyFilename = 'creds.json'
const storage = new Storage({ projectId, keyFilename });

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

listBuckets(); // Get buckets

// Get files
fred = storage.bucket("fred_chkn").getFiles((err, files, nextQuery, apiResponse) => {
    console.log(files)
    // Get contents of file
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
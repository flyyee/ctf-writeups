Category: GovTech (Misc)

Flag: WH2021{ea$y_Cl0uD_Ch@ll3ng3}

Steps:

Challenge Description

Fred Chee Hong Kat, a developer for Bug Bug Dev Ptd. Ltd, is a disgruntled employee with poor security hygiene! He has been flagged multiple times for poor password practices! Now, it finally hits him! Our threat intelligence feed discovered a set of leaked credentials available on the Dark Web. Can you help us investigate the matter? We need to know if our company's secrets are compromised!
_Attached is the file [creds.json]()_

Opening creds.json, we see that it contains

![image-20210314225558847](C:\Users\Gerrard Tai\AppData\Roaming\Typora\typora-user-images\image-20210314225558847.png)

Looks like a file containing **cred**entials for some service. Let’s google! Googling “client_x509_cert_url”, this looks to be an [account key](https://cloud.google.com/iam/docs/creating-managing-service-account-keys) for a Google Cloud service account.The flag is likely stored somewhere on the account’s Google Cloud. We pick out some [Google Cloud services](https://cloud.google.com/products) that look promising and narrow the most promising service down to Cloud Storage, which reads “Object storage for companies of all sizes. Store any amount of data. Retrieve it as often as you’d like.”.

Here’s what I’m thinking so far. We need to authorize ourselves using the credentials to use the Google Cloud service account to access a flag stored on Google Cloud Storage. So, to find out how to use the credentials for Google Cloud Storage, we look up [documentation](https://cloud.google.com/storage/docs/reference/libraries) for the service.

Since I am most familiar with Node.JS and already had it installed on my machine, I chose to implement my solution in Node.JS. Following the instructions on the page, I first installed the library with  ```npm install --save @google-cloud/storage```. Then I tried using the example they provided 

```// Imports the Google Cloud client libraryconst {Storage} = require('@google-cloud/storage');
// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();
// Creates a client from a Google service account key.
// const storage = new Storage({keyFilename: "key.json"});
// For more information on ways to initialize Storage, please see https://googleapis.dev/nodejs/storage/latest/Storage.html

/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
// const bucketName = 'bucket-name';

async function createBucket() {
  // Creates the new bucket
  await storage.createBucket(bucketName);
  console.log(`Bucket ${bucketName} created.`);
}

createBucket().catch(console.error);
```

I replaced "key.json" with creds.json. It works, however, Node.JS returns an error message that we do not have sufficient privileges to create a bucket. That makes sense, since the creator of the challenge wouldn’t want the Service account to have high privileges. Anyways, the flag is something that would likely already be on the cloud, and only require us to read it.

Now, I’d never used Google Cloud Storage before this, so I wasn’t sure where the flag could be stored. I decided to take a look at the [SDK Client Reference](https://googleapis.dev/nodejs/storage/latest/). Browsing the left sidebar, I tried looking out for any methods that would let me *get* something. Looking at the definition for "[File.get](https://googleapis.dev/nodejs/storage/latest/File.html#get-examples)", I noticed that the file was created by specifying a name of a file to a Bucket object. Once again, looking at the documentation for buckets, "[Bucket.getFiles](https://googleapis.dev/nodejs/storage/latest/Bucket.html#getFiles)" would return me the filenames of the files in a bucket. I would likely find a “flag.txt” there. However, the next thing I would have to do is [initialise the bucket](https://googleapis.dev/nodejs/storage/latest/Bucket.html#Bucket-examples), and I needed to pass its name. Looking under the sidebar again, I found the "[storage.getBuckets](https://googleapis.dev/nodejs/storage/latest/Storage.html#getBuckets)" method. 
I implemented the code

```
 async function listBuckets() {
    // Lists all buckets in the current project

    const [buckets] = await storage.getBuckets();
    console.log('Buckets:');
    buckets.forEach(bucket => {
      console.log(bucket.name);
    });
  }

  listBuckets().catch(console.error);
```

And got the bucket name “fred_chkn”. Hmm… I wonder who created this bucket? :) Then, I could use the getFiles method. With help from the documentation, I got ```fred = storage.bucket("fred_chkn").getFiles((err, files, nextQuery, apiResponse) => {console.log(files)})```

Using this, I found the file “secret.txt”. Bingo! Now, how do I save the file’s contents? Looking through the documentation once again, I discovered "[File.createReadStream](https://googleapis.dev/nodejs/storage/latest/File.html#createReadStream-examples)". Combining it with the file from the bucket, I got

```
storage.bucket("fred_chkn").file("secret.txt").createReadStream()
    .on('error', function (err) { })
    .on('response', function (response) {
    // Server connected and responded with the specified status and headers.
    })
    .on('end', function () {
    // The file is fully downloaded.
    })
    .pipe(fs.createWriteStream("log.txt"));
```

The end result of the code was.
Opening “log.txt” locally, I obtained the flag!

![image-20210314232233403](C:\Users\Gerrard Tai\AppData\Roaming\Typora\typora-user-images\image-20210314232233403.png)

[Final code]()

_First solve asia btw_
~flyyee
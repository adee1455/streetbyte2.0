import { Client, Databases, Storage } from 'appwrite';

const client = new Client();
client
  .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite Endpoint
  .setProject('676ab6070022406d8d64'); // Your project ID

const storage = new Storage(client);

export { client, storage };

![QDH Logo](https://quadratic.page/ballot-box-emoji.png)

# Quadratic Dollar Homepage

The Quadratic Dollar Homepage is a spin on the [Million Dollar Homepage](http://www.milliondollarhomepage.com/). While it also features a space for images on a webpage, it allows users to vote on how much space each image takes up. Moreover, it employs a quadratic and collusion-resistant voting mechanism on Ethereum called Minimal Anti-Collusion Infrastructure (MACI) to prevent bribery and scale images quadratically.

## How to run QDH locally

Clone this repo. Install dependencies by running `yarn` or `npm install`.

```bash
yarn
yarn dev # don't run it just yet
# or
npm install
npm run dev # don't run it just yet
```

In the root of the project, copy `.env.sample` file and name it `.env`.

Set values for all the missing variables, such as `MONGO_URL`, `ASURE_STORAGE_ACCOUNT_NAME`, `ASURE_CONTAINER_NAME`, `ASURE_KEY`, `ASURE_CONNECTION_STRING`.

> If you are are looking for a free Mongo hosting, try [Mongo Atlas](https://www.mongodb.com/cloud/atlas).

> If you are already running `yarn dev` or `npm run dev`, make sure to kill the process and start it again. Next.js
doesn't pick up `.env` changes automatically, hence you need to restart it manually.

On the output, you should see something like this:

```bash
$ yarn dev
Loaded env from /your-project-path/qdh/.env
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

QDH frontend should now be accessible on http://localhost:3000

Now you'll need to set up and deploy MACI:

### Setting up MACI

Clone MACI: https://github.com/appliedzkp/maci

Follow [these instructions](https://github.com/appliedzkp/maci#local-development-and-testing) to install Rust, build
zk-SNARKs, and compile contracts.

Start a Ganache instance in a separate terminal:
```bash
cd contracts
npm run ganache
```

Then run MACI. [Follow these steps](https://github.com/appliedzkp/maci/tree/master/cli#demonstration).

Once you've deployed MACI, and created an election (described in detail in the previous step), you should have an output
like this:

```
MACI: 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4
```

### Setting up Admin dashboard

Setting up and running Admin Dashboard is not mandatory, but recommended.
We've based it off an open source headless CMS, called [Strapi](https://strapi.io/)

Clone admin panel: https://github.com/ksaitor/qdh-admin and follow instruction in it's README.

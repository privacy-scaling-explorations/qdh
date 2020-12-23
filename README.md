# Quadratic Dollar Homepage

## How to run QDH locally

Clone this repo.

```bash
npm install
npm run dev # you dont have to run it just yet
# or
yarn
yarn dev # you dont have to run it just yet
```

Clone [MACI](https://github.com/appliedzkp/maci) `https://github.com/appliedzkp/maci`

Follow [these instructions](https://github.com/appliedzkp/maci#local-development-and-testing) to install Rust, build
zk-SNARKs, and compile contracts.

Then run MACI. [Follow these steps](https://github.com/appliedzkp/maci/tree/master/cli).

Once you've deployed MACI, and created an election (described in detail in the previous step), you should have an output
like this:

```
MACI: 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4
```

Now create `.env` file your `qdh` frontend directory and point `NEXT_PUBLIC_MACI_ADDRESS` to the your MACI address:

```
NEXT_PUBLIC_MACI_ADDRESS='0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4'
```

If you are already running `yarn dev` or `npm run dev`, make sure to kill the process and start it again. Next.js
doesn't pick up `.env` changes automatically, hence you need to restart it manually.

QDH frontend should now be accessible on http://localhost:3000

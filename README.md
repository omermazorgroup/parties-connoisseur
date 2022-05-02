This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Setup Local Environment

You need to setup a few API keys for this project to be setup correctly otherwise you won't see any parties.

- [Unsplash Access Key](https://unsplash.com/documentation)
- [Airtable Base and API Key](https://www.airtable.com/api)
- [Foursquare API Key](https://developer.foursquare.com/docs/migrate-to-newest-places-api-version#generating-api-keys)

For that, you can create a .env.local file in your project as [shown in docs](https://nextjs.org/docs/basic-features/environment-variables#loading-environment-variables) that will look like this:

```
AIRTABLE_BASE_KEY=<REPLACE THIS>
AIRTABLE_API_KEY=<REPLACE THIS>
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=<REPLACE THIS>
NEXT_PUBLIC_FOURSQUARE_API_KEY=<REPLACE THIS>
```

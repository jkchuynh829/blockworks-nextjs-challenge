const isProd = process.env.NODE_ENV === "production";

module.exports = {
  assetPrefix: isProd ? "/jkchuynh829/blockworks-nextjs-challenge/" : "",
  basePath: isProd ? "/jkchuynh829/blockworks-nextjs-challenge" : "",
  env: {
    API_BASE_URL: isProd
      ? process.env.NEXT_PUBLIC_GH_PAGES_API_BASE_URL
      : process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL,
  },
};

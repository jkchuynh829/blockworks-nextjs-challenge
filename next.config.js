const isProd = process.env.NODE_ENV === "production";

module.exports = {
  assetPrefix: isProd ? "/jkchuynh829/blockworks-nextjs-challenge/" : "",
  basePath: isProd ? "/jkchuynh829/blockworks-nextjs-challenge" : "",
};

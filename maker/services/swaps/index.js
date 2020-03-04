// import {
//   Actor,
//   BigNumber,
//   createActor as createActorSdk,
//   EthereumWallet,
//   InMemoryBitcoinWallet,
//   SwapRequest,
// } from "comit-sdk";

function loadEnvironment() {
  const envFilePath = path.join(os.homedir(), ".create-comit-app", "env");

  if (!fs.existsSync(envFilePath)) {
      console.log(
          "Could not find file %s. Did you run `yarn start-env`?",
          envFilePath
      );
      process.exit(1);
  }

  dotenv.config({ path: envFilePath });
}

async function createActor(index, name) {
  const bitcoinWallet = await InMemoryBitcoinWallet.newInstance(
      "regtest", // NOTE: this should be in .env as well
      process.env.BITCOIN_NODE_URI, // url
      process.env.BITCOIN_KEY // private key
  );
  await new Promise(r => setTimeout(r, 1000)); // TOFIX: WHY IS THIS CODE HERE?

  const ethereumWallet = new EthereumWallet(
      process.env.ETHEREUM_NODE_URL, // url
      process.env.ETHEREUM_KEY // private key
  );

  return createActorSdk(
      bitcoinWallet,
      ethereumWallet,
      process.env.CND_NODE_URL,
      name
  );
}

module.exports = function (fastify, opts, next) {
  fastify.post('/swaps', async function (request) {
    loadEnvironment();




    // TODO
    console.log(request);
    return { rates: json };
  })

  next()
}

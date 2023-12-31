import {
  TransactionEventTag,
  TransactionSummaryType,
} from "@concordium/node-sdk";
import {
  ConcordiumDatasourceKind,
  ConcordiumHandlerKind,
  ConcordiumProject,
} from "@subql/types-concordium";

const project: ConcordiumProject = {
  specVersion: "1.0.0",
  name: "concordium-testnet-starter",
  version: "0.0.1",
  runner: {
    node: {
      name: "@subql/node-concordium",
      version: "*",
    },
    query: {
      name: "@subql/query",
      version: "*",
    },
  },
  description:
    "This project can be use as a starting point for developing your new Concordium SubQuery project",
  repository: "https://github.com/subquery/concordium-subql-starter",
  schema: {
    file: "./schema.graphql",
  },
  network: {
    /**
     * chainId is the network identifier of the blockchain
     * In Concordium it is always the genesis hash of the network (hash of the first block)
     */
    chainId: "9dd9ca4d19e9393877d2c44b70f89acbfc0883c2243e5eeaecc0d1cd0503f478",
    /**
     * These endpoint(s) should be public non-pruned archive node
     * We recommend providing more than one endpoint for improved reliability, performance, and uptime
     * Public nodes may be rate limited, which can affect indexing speed
     * When developing your project we suggest getting a private API key
     * If you use a rate limited endpoint, adjust the --batch-size and --workers parameters
     * These settings can be found in your docker-compose.yaml, they will slow indexing but prevent your project being rate limited
     */
    endpoint: ["https://grpc.mainnet.concordium.software:20000"],
  },
  dataSources: [
    {
      kind: ConcordiumDatasourceKind.Runtime,
      startBlock: 490000, // This changes your indexing start block, set this higher to skip initial blocks with less data
      mapping: {
        file: "./dist/index.js",
        handlers: [
          /**
           * Avoid using block handlers where possible as they slow the indexing speed of your project
          {
            handler: "handleBlock",
            kind: ConcordiumHandlerKind.Block,
          },
           */
          {
            handler: "handleTransaction",
            kind: ConcordiumHandlerKind.Transaction,
            filter: {
              type: TransactionSummaryType.AccountTransaction,
              values: {
                transactionType: "transfer",
              },
            },
          },
          {
            handler: "handleTransactionEvent",
            kind: ConcordiumHandlerKind.TransactionEvent,
            filter: {
              type: TransactionEventTag.Updated,
            },
          },
          {
            handler: "handleSpecialEvent",
            kind: ConcordiumHandlerKind.SpecialEvent,
            filter: {
              type: "blockAccrueReward",
            },
          },
        ],
      },
    },
  ],
};

// Must set default to the project instance
export default project;

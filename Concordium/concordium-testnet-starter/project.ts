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
    chainId: "4221332d34e1694168c2a0c0b3fd0f273809612cb13d000d5c2e00e85f50f796",
    /**
     * These endpoint(s) should be public non-pruned archive node
     * We recommend providing more than one endpoint for improved reliability, performance, and uptime
     * Public nodes may be rate limited, which can affect indexing speed
     * When developing your project we suggest getting a private API key
     */
    endpoint: ["node.testnet.concordium.com:20000"],
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

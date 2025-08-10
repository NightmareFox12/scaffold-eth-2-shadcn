import { toast } from "sonner";
import { Hash, SendTransactionParameters, TransactionReceipt, WalletClient } from "viem";
import { Config, useWalletClient } from "wagmi";
import { getPublicClient } from "wagmi/actions";
import { SendTransactionMutate } from "wagmi/query";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import { getBlockExplorerTxLink, getParsedError } from "~~/utils/scaffold-eth";
import { TransactorFuncOptions } from "~~/utils/scaffold-eth/contract";

type TransactionFunc = (
  tx: (() => Promise<Hash>) | Parameters<SendTransactionMutate<Config, undefined>>[0],
  options?: TransactorFuncOptions,
) => Promise<Hash | undefined>;

/**
 * Custom notification content for TXs.
 */
// const TxnNotification = ({ message, blockExplorerLink }: { message: string; blockExplorerLink?: string }) => {
//   return (
// <div className={`flex flex-col ml-1 cursor-default`}>
//   <p className="my-0">{message}</p>
//   {blockExplorerLink && blockExplorerLink.length > 0 ? (
//     <a href={blockExplorerLink} target="_blank" rel="noreferrer" className="block link">
//       check out transaction
//     </a>
//   ) : null}
// </div>
//   );
// };

/**
 * Runs Transaction passed in to returned function showing UI feedback.
 * @param _walletClient - Optional wallet client to use. If not provided, will use the one from useWalletClient.
 * @returns function that takes in transaction function as callback, shows UI feedback for transaction and returns a promise of the transaction hash
 */
export const useTransactor = (_walletClient?: WalletClient): TransactionFunc => {
  let walletClient = _walletClient;
  const { data } = useWalletClient();
  if (walletClient === undefined && data) {
    walletClient = data;
  }

  const result: TransactionFunc = async (tx, options) => {
    if (!walletClient) {
      // notification.error("Cannot access account");
      toast.error("Cannot access account");
      console.error("⚡️ ~ file: useTransactor.tsx ~ error");
      return;
    }

    let toastID: string | number | null = null;
    let transactionHash: Hash | undefined = undefined;
    let transactionReceipt: TransactionReceipt | undefined;
    let blockExplorerTxURL = "";
    try {
      const network = await walletClient.getChainId();
      // Get full transaction from public client
      const publicClient = getPublicClient(wagmiConfig);

      toastID = toast.loading("Awaiting for user confirmation");
      // notificationId = notification.loading(<TxnNotification message="Awaiting for user confirmation" />);

      if (typeof tx === "function") {
        // Tx is already prepared by the caller
        const result = await tx();
        transactionHash = result;
      } else if (tx != null) {
        transactionHash = await walletClient.sendTransaction(tx as SendTransactionParameters);
      } else {
        throw new Error("Incorrect transaction passed to transactor");
      }
      // notification.remove(notificationId);
      toast.dismiss(toastID ?? "");

      blockExplorerTxURL = network ? getBlockExplorerTxLink(network, transactionHash) : "";

      // notificationId = notification.loading(
      //   <TxnNotification message="Waiting for transaction to complete." blockExplorerLink={blockExplorerTxURL} />,
      // );

      const promise = publicClient.waitForTransactionReceipt({
        hash: transactionHash,
        confirmations: options?.blockConfirmations,
      });

      transactionReceipt = await promise;

      toastID = toast
        .promise(promise, {
          loading: "Waiting",
          success: "Transaction completed successfully!",
          closeButton: true,
          action:
            blockExplorerTxURL && blockExplorerTxURL.length > 0
              ? {
                  label: "Check out transaction",
                  onClick: () => {
                    window.open(blockExplorerTxURL, "_blank", "noopener,noreferrer");
                  },
                }
              : null,
        })
        .toString();

      // notification.remove(notificationId);
      // toast.dismiss(toastID ?? "");

      if (transactionReceipt.status === "reverted") throw new Error("Transaction reverted");

      // notification.success(
      //   <TxnNotification message="Transaction completed successfully!" blockExplorerLink={blockExplorerTxURL} />,
      //   {
      //     icon: "🎉",
      //   },
      // );
      // toastID = toast("success");

      if (options?.onBlockConfirmation) options.onBlockConfirmation(transactionReceipt);
    } catch (error: any) {
      if (toastID) toast.dismiss(toastID);

      console.error("⚡️ ~ file: useTransactor.ts ~ error", error);
      const message = getParsedError(error);

      // if receipt was reverted, show notification with block explorer link and return error
      if (transactionReceipt?.status === "reverted") {
        // notification.error(<TxnNotification message={message} blockExplorerLink={blockExplorerTxURL} />);
        toast.error(message, { closeButton: true });
        throw error;
      }

      toast.error(message, {
        action: (
          <>
            {blockExplorerTxURL && blockExplorerTxURL.length > 0 ? (
              <a href={blockExplorerTxURL} target="_blank" rel="noreferrer" className="block link">
                check out transaction
              </a>
            ) : null}
          </>
        ),
        closeButton: true,
      });

      throw error;
    }

    return transactionHash;
  };

  return result;
};

import { CheckCircle, Files } from "lucide-react";
import { TransactionReceipt } from "viem";
import { ObjectFieldDisplay } from "~~/app/debug/_components/contract";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~~/components/ui/shadcn/collapsible";
import { ScrollArea } from "~~/components/ui/shadcn/scroll-area";
import { useCopyToClipboard } from "~~/hooks/scaffold-eth/useCopyToClipboard";
import { replacer } from "~~/utils/scaffold-eth/common";

export const TxReceipt = ({ txResult }: { txResult: TransactionReceipt }) => {
  const { copyToClipboard: copyTxResultToClipboard, isCopiedToClipboard: isTxResultCopiedToClipboard } =
    useCopyToClipboard();
  //TODO BUSCAR LA FORMA QUE EL PRE CODE QUEDE BIEN
  return (
    <div className="flex text-sm  bg-secondary py-2 px-1 gap-2">
      <div className="mt-1 pl-2">
        {isTxResultCopiedToClipboard ? (
          <CheckCircle />
        ) : (
          // <CheckCircleIcon
          //   className="ml-1.5 text-xl font-normal text-base-content h-5 w-5 cursor-pointer"
          //   aria-hidden="true"
          // />
          <Files
            className="cursor-pointer"
            onClick={() => copyTxResultToClipboard(JSON.stringify(txResult, replacer, 2))}
          />
          // <DocumentDuplicateIcon
          //   className="ml-1.5 text-xl font-normal h-5 w-5 cursor-pointer"
          //   aria-hidden="true"
          //   onClick={() => copyTxResultToClipboard(JSON.stringify(txResult, replacer, 2))}
          // />
        )}
      </div>
      <Collapsible className="flex flex-1">
        <CollapsibleTrigger className="font-semibold flex-1 text-start cursor-pointer">
          Transaction Receipt
        </CollapsibleTrigger>
        <CollapsibleContent className="w-full">
          <ScrollArea className="h-[200px] p-3 text-sm">
            <pre className="text-xs">
              {Object.entries(txResult).map(([k, v]) => (
                <ObjectFieldDisplay name={k} value={v} size="xs" leftPad={false} key={k} />
              ))}
            </pre>
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>

      {/* <div tabIndex={0} className="flex-wrap collapse collapse-arrow">
        <input type="checkbox" className="min-h-0! peer" />
        <div className="collapse-title text-sm min-h-0! py-1.5 pl-1 after:top-4!">
          <strong>Transaction Receipt</strong>
        </div>
        <div className="collapse-content overflow-auto bg-secondary rounded-t-none rounded-3xl pl-0!">
          <pre className="text-xs">
            {Object.entries(txResult).map(([k, v]) => (
              <ObjectFieldDisplay name={k} value={v} size="xs" leftPad={false} key={k} />
            ))}
          </pre>
        </div>
      </div> */}
    </div>
  );
};

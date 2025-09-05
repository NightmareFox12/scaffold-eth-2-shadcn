import { NetworkOptions } from "./NetworkOptions";
import { ChevronDown, LogOut } from "lucide-react";
import { useDisconnect } from "wagmi";
import { Button } from "~~/components/ui/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~~/components/ui/shadcn/dropdown-menu";

export const WrongNetworkDropdown = () => {
  const { disconnect } = useDisconnect();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="dark:bg-primary-foreground text-red-500 dark:hover:bg-primary-foreground/80">
          <ChevronDown className="w-4 h-4 " />
          Wrong Network
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="font-semibold">
        <NetworkOptions />
        <DropdownMenuItem onClick={() => disconnect()} className="cursor-pointer text-red-500 hover:text-red-500">
          <LogOut className="w-4 h-4 text-red-500" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    // <div className="dropdown dropdown-end mr-2">
    //   <label tabIndex={0} className="btn btn-error btn-sm dropdown-toggle gap-1">
    //     <span>Wrong network</span>
    //     {/* <ChevronDownIcon className="h-6 w-4 ml-2 sm:ml-0" /> */}
    //   </label>
    //   <ul
    //     tabIndex={0}
    //     className="dropdown-content menu p-2 mt-1 shadow-center shadow-accent bg-base-200 rounded-box gap-1"
    //   >
    //     <NetworkOptions />
    //     <li>
    //       <Button
    //         className="menu-item text-error btn-sm rounded-xl! flex gap-3 py-3"
    //         type="button"
    //         onClick={() => disconnect()}
    //       >
    //         {/* <ArrowLeftOnRectangleIcon className="h-6 w-4 ml-2 sm:ml-0" /> */}
    //         <span>Disconnect</span>
    //       </Button>
    //     </li>
    //   </ul>
    // </div>
  );
};

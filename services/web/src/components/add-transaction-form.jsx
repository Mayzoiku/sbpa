import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const InputWithLabel = ({ label, ...props }) => {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={props.id}>{label}</Label>
      <Input {...props} />
    </div>
  );
};

const AddTransaction = ({ trigger }) => {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <InputWithLabel
              label="Description"
              id="description"
              placeholder="eg. Money to mom"
            />
            <InputWithLabel label="Amount" id="amount" placeholder="eg. 100" />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Wallet</Label>
            <Select defaultValue="wallet-1">
              <SelectTrigger>
                <SelectValue placeholder="Select a wallet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wallet-1">Wallet 1</SelectItem>
                <SelectItem value="wallet-2">Wallet 2</SelectItem>
                <SelectItem value="wallet-3">Wallet 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Add Transaction</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default AddTransaction;

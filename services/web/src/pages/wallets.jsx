import { useQuery } from "@tanstack/react-query";
import wallet from "@/services/wallet";

const Wallets = () => {
  const { data: wallets } = useQuery({
    queryKey: ["wallets"],
    queryFn: wallet.getWallets,
  });

  const { data: transactions } = useQuery({
    queryKey: ["transactions"],
    queryFn: wallet.getTransactions,
  });

  return <div>Wallets</div>;
};

export default Wallets;

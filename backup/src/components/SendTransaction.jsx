jsx
import { useSendTransaction } from 'wagmi';
import { parseEther } from 'ethers/lib/utils';
function SendTransaction() {
  const { sendTransaction } = useSendTransaction();

  const handleSend = async () => {
    try {
      await sendTransaction({
        to: '0xRecipientAddress',
        value: parseEther('0.01'),
      });
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  return <button onClick={handleSend}>Send 0.01 ETH</button>;
}

export default SendTransaction;
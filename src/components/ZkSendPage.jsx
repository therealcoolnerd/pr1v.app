import React from 'react';

function ZkSendPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">ZkSend</h1>

      {/* Deposit Section */}
      <div className="mb-8 p-4 border border-gray-700 rounded-lg bg-gray-800">
        <h2 className="text-xl font-semibold mb-4 text-white">Deposit</h2>
        {/* Deposit Form */}
        <form>
          <div className="mb-4">
            <label htmlFor="depositToken" className="block text-sm font-medium text-gray-300">Token:</label>
            <input type="text" id="depositToken" name="depositToken" className="mt-1 p-2 w-full border border-gray-600 rounded-md bg-gray-700 text-white" placeholder="Token Address" />
          </div>
          <div className="mb-4">
            <label htmlFor="depositAmount" className="block text-sm font-medium text-gray-300">Amount:</label>
            <input type="number" id="depositAmount" name="depositAmount" className="mt-1 p-2 w-full border border-gray-600 rounded-md bg-gray-700 text-white" placeholder="Amount" />
          </div>
          <div className="mb-4">
            <label htmlFor="depositCommitment" className="block text-sm font-medium text-gray-300">Commitment:</label>
            <input type="text" id="depositCommitment" name="depositCommitment" className="mt-1 p-2 w-full border border-gray-600 rounded-md bg-gray-700 text-white" placeholder="Commitment" />
          </div>
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Deposit</button>
        </form>
      </div>

      {/* Withdraw Section */}
      <div className="p-4 border border-gray-700 rounded-lg bg-gray-800">
        <h2 className="text-xl font-semibold mb-4 text-white">Withdraw</h2>
        {/* Withdraw Form */}
        <form>
          <div className="mb-4">
            <label htmlFor="withdrawProof" className="block text-sm font-medium text-gray-300">Proof:</label>
            <input type="text" id="withdrawProof" name="withdrawProof" className="mt-1 p-2 w-full border border-gray-600 rounded-md bg-gray-700 text-white" placeholder="Proof" />
          </div>
          <div className="mb-4">
            <label htmlFor="withdrawPubSignals" className="block text-sm font-medium text-gray-300">Public Signals:</label>
            <input type="text" id="withdrawPubSignals" name="withdrawPubSignals" className="mt-1 p-2 w-full border border-gray-600 rounded-md bg-gray-700 text-white" placeholder="Public Signals" />
          </div>
          <div className="mb-4">
            <label htmlFor="withdrawNullifier" className="block text-sm font-medium text-gray-300">Nullifier:</label>
            <input type="text" id="withdrawNullifier" name="withdrawNullifier" className="mt-1 p-2 w-full border border-gray-600 rounded-md bg-gray-700 text-white" placeholder="Nullifier" />
          </div>
          <div className="mb-4">
            <label htmlFor="withdrawRecipient" className="block text-sm font-medium text-gray-300">Recipient:</label>
            <input type="text" id="withdrawRecipient" name="withdrawRecipient" className="mt-1 p-2 w-full border border-gray-600 rounded-md bg-gray-700 text-white" placeholder="Recipient Address" />
          </div>
          <div className="mb-4">
            <label htmlFor="withdrawToken" className="block text-sm font-medium text-gray-300">Token:</label>
            <input type="text" id="withdrawToken" name="withdrawToken" className="mt-1 p-2 w-full border border-gray-600 rounded-md bg-gray-700 text-white" placeholder="Token Address" />
          </div>
          <div className="mb-4">
            <label htmlFor="withdrawAmount" className="block text-sm font-medium text-gray-300">Amount:</label>
            <input type="number" id="withdrawAmount" name="withdrawAmount" className="mt-1 p-2 w-full border border-gray-600 rounded-md bg-gray-700 text-white" placeholder="Amount" />
          </div>
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Withdraw</button>
        </form>
      </div>
    </div>
  );
}

export default ZkSendPage;
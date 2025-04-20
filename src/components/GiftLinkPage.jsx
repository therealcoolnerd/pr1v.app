import React from 'react';

function GiftLinkPage() {
    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-800 text-white p-8">
            <h1 className="text-4xl font-bold mb-4">Gift Link Factory</h1>
            <p className="text-lg text-gray-300 max-w-xl text-center mb-8">
                Create and share secure links to gift ETH or ERC20 tokens to anyone. Simply set the amount, specify the token, and share the unique link. Claiming the gift is easy, secure, and private.
            </p>
            <section className="mb-8 w-full max-w-3xl">
                <h2 className="text-2xl font-semibold mb-4">Create a New Gift</h2>
                {/* Add New Gift Form Here */}
            </section>

            <section className="w-full max-w-3xl">
                <h2 className="text-2xl font-semibold mb-4">Claim a Gift</h2>
                {/* Add Claim Gift Form Here */}
            </section>
        </div>
    );
}

export default GiftLinkPage;
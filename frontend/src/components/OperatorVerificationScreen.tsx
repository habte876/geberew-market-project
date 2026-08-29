import { useState, useEffect } from "react";

type PendingPrice = {
  id: string;
  price_value: string;
  unit: string;
  effective_date: string;
  source: string;
  crop_name: string;
  market_name: string;
};

type Props = {
  refreshTrigger: number;
};

function OperatorVerificationScreen({ refreshTrigger }: Props) {
  const [pendingPrices, setPendingPrices] = useState<PendingPrice[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadPendingPrices() {
    setLoading(true);
    const res = await fetch("http://localhost:4000/prices/pending");
    const data = await res.json();
    setPendingPrices(data);
    setLoading(false);
  }

  useEffect(() => {
    loadPendingPrices();
  }, [refreshTrigger]);

  async function handleVerify(priceId: string) {
    const operatorId = "827a5089-52e0-43b7-b282-18c6a736d01c";

    await fetch(`http://localhost:4000/prices/${priceId}/verify`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verifiedBy: operatorId }),
    });

    loadPendingPrices();
  }

  async function handleReject(priceId: string) {
    const operatorId = "827a5089-52e0-43b7-b282-18c6a736d01c";

    await fetch(`http://localhost:4000/prices/${priceId}/reject`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verifiedBy: operatorId }),
    });

    loadPendingPrices();
  }

  if (loading) {
    return <p className="text-center mt-10">Loading pending prices...</p>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Operator queue ({pendingPrices.length})
      </h2>

      {pendingPrices.length === 0 && (
        <p className="text-gray-500">No prices waiting for review.</p>
      )}

      <div className="space-y-3">
        {pendingPrices.map((price) => (
          <div
            key={price.id}
            className="bg-gray-50 p-4 rounded-lg border border-gray-200"
          >
            <p className="font-semibold text-gray-800">
              {price.crop_name} — {price.market_name}
            </p>
            <p className="text-sm text-gray-500 mb-3">
              {price.price_value} ETB / {price.unit} · effective{" "}
              {price.effective_date.split("T")[0]}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleVerify(price.id)}
                className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(price.id)}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OperatorVerificationScreen;

import { useState, useEffect } from "react";

type Crop = {
  id: string;
  name_en: string;
  name_am: string;
  name_om: string;
};

type Market = {
  id: string;
  name: string;
};

type Props = {
  onSubmitted: () => void;
};

function PriceSubmissionForm({ onSubmitted }: Props) {
  const [cropId, setCropId] = useState("");
  const [marketId, setMarketId] = useState("");
  const [priceValue, setPriceValue] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [unit, setUnit] = useState("kg");

  const [crops, setCrops] = useState<Crop[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);

  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("http://localhost:4000/crops")
      .then((res) => res.json())
      .then((data) => setCrops(data));

    fetch("http://localhost:4000/markets")
      .then((res) => res.json())
      .then((data) => setMarkets(data));
  }, []);

  async function handleSubmit() {
    if (!cropId || !marketId || !priceValue || !effectiveDate) {
      setStatusMessage("Please fill in every field before submitting.");
      return;
    }

    if (Number(priceValue) <= 0) {
      setStatusMessage("Price must be a positive number.");
      return;
    }

    if (effectiveDate < new Date().toISOString().split("T")[0]) {
      setStatusMessage("Effective date cannot be in the past.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("");

    try {
      const response = await fetch("http://localhost:4000/prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropId,
          marketId,
          priceValue: Number(priceValue),
          effectiveDate,
          unit,
          submittedBy: "5416e5ac-4105-4c74-a6ba-f7b11bef5256",
          source: "web",
        }),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setStatusMessage("Price submitted successfully — pending verification.");
      setCropId("");
      setMarketId("");
      setPriceValue("");
      setEffectiveDate("");
      setUnit("kg");
      onSubmitted();
    } catch (err) {
      setStatusMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Submit a Price</h2>

      <label className="block mb-1 text-sm font-medium text-gray-700">
        Crop
      </label>
      <select
        value={cropId}
        onChange={(e) => setCropId(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">Select a crop</option>
        {crops.map((crop) => (
          <option key={crop.id} value={crop.id}>
            {crop.name_en} / {crop.name_am} / {crop.name_om}
          </option>
        ))}
      </select>

      <label className="block mb-1 text-sm font-medium text-gray-700">
        Market
      </label>
      <select
        value={marketId}
        onChange={(e) => setMarketId(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">Select a market</option>
        {markets.map((market) => (
          <option key={market.id} value={market.id}>
            {market.name}
          </option>
        ))}
      </select>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Price (ETB)
          </label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={priceValue}
            onChange={(e) => setPriceValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g. 45.50"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Effective Date
          </label>
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={effectiveDate}
            onChange={(e) => setEffectiveDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <label className="block mb-1 text-sm font-medium text-gray-700">
        Unit
      </label>
      <select
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="kg">kg</option>
        <option value="quintal">quintal</option>
      </select>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full bg-green-600 text-white py-2 rounded-md font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Submitting..." : "Submit for review"}
      </button>

      {statusMessage && (
        <p className="mt-4 text-sm text-center text-gray-700">
          {statusMessage}
        </p>
      )}
    </div>
  );
}

export default PriceSubmissionForm;

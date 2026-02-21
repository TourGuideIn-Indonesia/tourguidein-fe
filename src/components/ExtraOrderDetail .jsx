import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosPrivate from "../api/axiosPrivate";
import { loadMidtransSnap } from "../utils/loadMidtrans";

function ExtraOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [extra, setExtra] = useState(null);

  useEffect(() => {
    axiosPrivate
      .get(`/api/extras-data/${id}`)
      .then((res) => setExtra(res.data.data))
      .catch(console.error);
  }, [id]);

  if (!extra) {
    return <div className="min-h-screen flex items-center justify-center">Loading extra order...</div>;
  }

  /* ===============================
   * ACTIONS
   * =============================== */

  const handleCancelExtra = async () => {
    if (!window.confirm("Cancel this extra order?")) return;

    try {
      await axiosPrivate.patch(`/api/booking/${extra.id}`, {
        action: "cancel",
      });

      alert("Extra order cancelled");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to cancel extra order");
    }
  };

  const handleMakePayment = async () => {
    try {
      await loadMidtransSnap();

      const res = await axiosPrivate.post("/api/booking", {
        order_id: extra.id,
      });

      const snap = res.data.data.snap;

      if (!snap?.snap_token) {
        throw new Error("Snap token not found");
      }

      window.snap.pay(snap.snap_token, {
        onSuccess: () => window.location.reload(),
        onPending: () => alert("Waiting for payment"),
        onError: () => alert("Payment failed"),
      });
    } catch (err) {
      console.error(err);
      alert("Failed to initiate payment");
    }
  };

  /* ===============================
   * UI
   * =============================== */

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h1 className="text-xl font-bold">
            {extra.detail?.name ?? "Extra Service"}
          </h1>
          <p className="text-sm text-gray-500">
            {extra.detail?.category}
          </p>
        </div>

        {/* Summary */}
        <div className="bg-white p-6 rounded-2xl shadow space-y-2 text-sm">
          <p>Description: {extra.detail?.description}</p>
          <p>Qty: {extra.detail?.qty}</p>
          <p>Total: Rp {extra.price.amount_paid_by_traveller}</p>
          <p>Status: {extra.status.transaction_status}</p>
          <p>
            Refundable: {extra.detail?.is_refundable ? "Yes" : "No"}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">

          {/* Cancel */}
          {["pending", "accepted", "paid"].includes(extra.status.order_status) && (
            <button
              onClick={handleCancelExtra}
              className="px-5 py-2 rounded-xl border border-red-500 text-red-500 hover:bg-red-50"
            >
              Cancel Extra
            </button>
          )}

          {/* Payment */}
          {extra.status.transaction_status !== "settlement" && (
              <button
                onClick={handleMakePayment}
                className="px-5 py-2 rounded-xl bg-black text-white hover:opacity-90"
              >
                Make Payment
              </button>
            )}
        </div>

      </div>
    </div>
  );
}

export default ExtraOrderDetail;
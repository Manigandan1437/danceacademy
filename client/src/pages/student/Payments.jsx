import { useQuery } from "@tanstack/react-query";
import { CreditCard, CheckCircle, Clock, FileDown } from "lucide-react";
import { jsPDF } from "jspdf";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const statusColor = {
  completed: "bg-green-500/20 text-green-400",
  pending: "bg-amber-500/20 text-amber-400",
  failed: "bg-red-500/20 text-red-400",
};

const generateReceiptPDF = (payment, studentName) => {
  const doc = new jsPDF({ unit: "mm", format: "a5" });
  const W = 148;

  // Header background
  doc.setFillColor(88, 28, 135);
  doc.rect(0, 0, W, 32, "F");

  // Academy title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("DANCE ACADEMY", W / 2, 14, { align: "center" });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("PAYMENT RECEIPT", W / 2, 23, { align: "center" });

  // Divider
  doc.setDrawColor(168, 85, 247);
  doc.setLineWidth(0.4);
  doc.line(12, 38, W - 12, 38);

  const rows = [
    ["Receipt No", payment.receiptNumber || "—"],
    [
      "Date",
      payment.paidAt
        ? new Date(payment.paidAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
        : "—",
    ],
    ["Student", studentName || "—"],
    ["Class", payment.class?.name || "—"],
    ["Description", payment.description || "Fee Payment"],
    [
      "Amount Paid",
      "\u20B9" + Number(payment.amount || 0).toLocaleString("en-IN"),
    ],
    [
      "Payment Method",
      (payment.paymentMethod || "razorpay").replace(/_/g, " ").toUpperCase(),
    ],
    ["Status", (payment.status || "completed").toUpperCase()],
  ];

  let y = 50;
  rows.forEach(([label, value], i) => {
    if (i % 2 === 0) {
      doc.setFillColor(248, 246, 255);
      doc.rect(12, y - 5.5, W - 24, 10, "F");
    }
    doc.setFontSize(9);
    doc.setTextColor(100, 80, 140);
    doc.setFont("helvetica", "normal");
    doc.text(label + ":", 16, y);
    doc.setTextColor(20, 20, 20);
    doc.setFont("helvetica", "bold");
    doc.text(String(value), 72, y);
    y += 13;
  });

  // Footer line
  doc.setDrawColor(168, 85, 247);
  doc.setLineWidth(0.3);
  doc.line(12, y + 5, W - 12, y + 5);

  doc.setFontSize(7.5);
  doc.setTextColor(120, 100, 150);
  doc.setFont("helvetica", "italic");
  doc.text(
    "This is a computer-generated receipt and does not require a signature.",
    W / 2,
    y + 13,
    { align: "center" }
  );

  doc.save(`Receipt-${payment.receiptNumber || payment._id}.pdf`);
};

const StudentPayments = () => {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["my-payments"],
    queryFn: () => api.get("/payments/my").then((r) => r.data.data),
  });

  const payments = Array.isArray(data) ? data : [];
  const total = payments
    .filter((p) => p.status === "completed")
    .reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Payments</h1>
        <div className="card py-2 px-4 text-center">
          <p className="text-lg font-bold text-emerald-400">
            ₹{total.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-gray-400">Total Paid</p>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : payments.length === 0 ? (
        <div className="card py-16 text-center">
          <CreditCard size={40} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No payment records yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((p) => (
            <div key={p._id} className="card flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${p.status === "completed" ? "bg-green-500/20" : "bg-amber-500/20"}`}
              >
                {p.status === "completed" ? (
                  <CheckCircle size={18} className="text-green-400" />
                ) : (
                  <Clock size={18} className="text-amber-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white text-sm font-medium">
                  {p.class?.name}
                </h3>
                <p className="text-xs text-gray-400">
                  {p.description ||
                    (p.billingPeriod?.startDate
                      ? new Date(p.billingPeriod.startDate).toLocaleDateString(
                          "en-IN"
                        )
                      : "—")}
                </p>
                {p.receiptNumber && (
                  <p className="text-xs text-gray-500 mt-0.5 font-mono">
                    {p.receiptNumber}
                  </p>
                )}
              </div>
              <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                <p className="font-semibold text-white">₹{p.amount}</p>
                <span
                  className={`badge text-xs capitalize ${statusColor[p.status]}`}
                >
                  {p.status}
                </span>
                {p.status === "completed" && (
                  <button
                    onClick={() => generateReceiptPDF(p, user?.name)}
                    className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 transition-colors mt-0.5"
                    title="Download PDF Receipt"
                  >
                    <FileDown size={13} />
                    Receipt
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentPayments;

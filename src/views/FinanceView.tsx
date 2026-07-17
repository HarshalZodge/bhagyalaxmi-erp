"use client";

import React, { useState } from "react";
import {
  IndianRupee,
  TrendingUp,
  FileCheck2,
  TrendingDown,
  Plus,
  Trash2,
  Receipt,
} from "lucide-react";
import { useERP, Invoice, Expense } from "@/context/ERPContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { GlassSelect } from "@/components/ui/GlassSelect";

export const FinanceView: React.FC = () => {
  const { invoices, expenses, addExpense, updateBookingStatus } = useERP();
  
  // Form states for new expenses
  const [expenseCategory, setExpenseCategory] = useState("Catering");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expensePayee, setExpensePayee] = useState("");
  const [expenseDesc, setExpenseDesc] = useState("");

  const [showAddExpense, setShowAddExpense] = useState(false);

  // Math metrics
  // Paid Invoices Total
  const totalRevenue = invoices
    .filter((inv) => inv.status === "Paid")
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const totalCGST = invoices
    .filter((inv) => inv.status === "Paid")
    .reduce((sum, inv) => sum + inv.cgst, 0);

  const totalSGST = invoices
    .filter((inv) => inv.status === "Paid")
    .reduce((sum, inv) => sum + inv.sgst, 0);

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netProfit = totalRevenue - totalCGST - totalSGST - totalExpenses;

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (expenseAmount && expensePayee && expenseDesc) {
      addExpense({
        category: expenseCategory,
        amount: Number(expenseAmount),
        payee: expensePayee,
        description: expenseDesc,
      });
      // Reset
      setExpenseAmount("");
      setExpensePayee("");
      setExpenseDesc("");
      setShowAddExpense(false);
    }
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in select-none">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-purple-royal leading-none">
            Financial Ledger & Tax
          </h2>
          <p className="text-xs text-charcoal-dark/50 mt-1.5 font-medium uppercase tracking-wide">
            GST CGST/SGST audit logs, expenditures, and income declarations
          </p>
        </div>
        <GlassButton variant="gold" onClick={() => setShowAddExpense(!showAddExpense)}>
          <Plus size={16} /> Log Expense
        </GlassButton>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassCard variant="purple" className="flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-purple-royal/60 uppercase tracking-widest leading-none">
              Paid Revenue (Invoiced)
            </p>
            <h3 className="text-xl font-extrabold text-purple-royal mt-2">
              {formatINR(totalRevenue)}
            </h3>
          </div>
          <span className="text-[9px] font-semibold text-emerald-600 mt-4 flex items-center gap-1">
            <TrendingUp size={12} /> Direct Bank Deposits
          </span>
        </GlassCard>

        <GlassCard variant="default" className="flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-charcoal-dark/50 uppercase tracking-widest leading-none">
              Taxes Payable (CGST + SGST)
            </p>
            <h3 className="text-xl font-extrabold text-charcoal-dark mt-2">
              {formatINR(totalCGST + totalSGST)}
            </h3>
          </div>
          <span className="text-[9px] font-semibold text-charcoal-dark/45 mt-4">
            CGST: {formatINR(totalCGST)} | SGST: {formatINR(totalSGST)}
          </span>
        </GlassCard>

        <GlassCard variant="default" className="flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-charcoal-dark/50 uppercase tracking-widest leading-none">
              Total Expenses
            </p>
            <h3 className="text-xl font-extrabold text-rose-600 mt-2">
              {formatINR(totalExpenses)}
            </h3>
          </div>
          <span className="text-[9px] font-semibold text-rose-500/80 mt-4 flex items-center gap-1">
            <TrendingDown size={12} /> Staff, Diesel, Electric
          </span>
        </GlassCard>

        <GlassCard variant="gold" className="flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-gold-dark uppercase tracking-widest leading-none">
              Net Tax-Free Profit
            </p>
            <h3 className="text-xl font-extrabold text-gold-dark mt-2">
              {formatINR(netProfit)}
            </h3>
          </div>
          <span className="text-[9px] font-semibold text-gold-dark/80 mt-4">
            After 18% GST Deduction
          </span>
        </GlassCard>
      </div>

      {/* Pop-up Add Expense form */}
      {showAddExpense && (
        <GlassCard className="p-6 border-white/60 bg-white/40 max-w-xl animate-fade-in">
          <h3 className="text-sm font-bold uppercase tracking-wider text-purple-royal border-b border-purple-royal/10 pb-2 mb-4">
            Log New Operational Expense
          </h3>
          <form onSubmit={handleCreateExpense} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GlassSelect
              label="Expenditure Category"
              options={[
                { value: "Catering", label: "Catering Supplies" },
                { value: "Decor", label: "Florist / Stage Decor" },
                { value: "Generator Diesel", label: "Generator Diesel Fuel" },
                { value: "Electricity Bill", label: "Electricity MSEDCL bill" },
                { value: "Staff Salaries", label: "Staff Salaries" },
              ]}
              value={expenseCategory}
              onChange={(e) => setExpenseCategory(e.target.value)}
            />
            <GlassInput
              label="Amount Paid (₹)"
              type="number"
              placeholder="e.g. 25000"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              required
            />
            <GlassInput
              label="Payee Company / Worker"
              placeholder="e.g. Indian Oil Bhingar"
              value={expensePayee}
              onChange={(e) => setExpensePayee(e.target.value)}
              required
            />
            <GlassInput
              label="Brief Description"
              placeholder="e.g. Purchase of 200L diesel"
              value={expenseDesc}
              onChange={(e) => setExpenseDesc(e.target.value)}
              required
            />
            <div className="sm:col-span-2 flex justify-end gap-2 pt-2 border-t border-purple-royal/10">
              <GlassButton
                variant="secondary"
                type="button"
                onClick={() => setShowAddExpense(false)}
              >
                Cancel
              </GlassButton>
              <GlassButton variant="gold" type="submit">
                Log Expense
              </GlassButton>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Invoices and Expenses Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invoices List */}
        <GlassCard className="p-6 border-white/60 bg-white/40 space-y-4">
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-purple-royal">
              Active GST Invoice Records
            </h4>
            <p className="text-[10px] text-charcoal-dark/50">
              18% GST (9% CGST + 9% SGST) breakdown details
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-purple-royal/15 font-bold text-purple-royal/80 pb-2">
                  <th className="py-2.5">Invoice No</th>
                  <th className="py-2.5">Client</th>
                  <th className="py-2.5 text-right">Taxable</th>
                  <th className="py-2.5 text-right">GST (18%)</th>
                  <th className="py-2.5 text-right">Total</th>
                  <th className="py-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-royal/5">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-purple-royal/[0.02]">
                    <td className="py-3 font-bold text-purple-royal">{inv.invoiceNo}</td>
                    <td className="py-3 font-semibold">{inv.clientName}</td>
                    <td className="py-3 text-right text-charcoal-dark/60">
                      ₹{inv.taxableAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 text-right text-charcoal-dark/60">
                      ₹{(inv.cgst + inv.sgst).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 text-right font-bold">
                      ₹{inv.totalAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border inline-block ${
                          inv.status === "Paid"
                            ? "bg-emerald-50/10 text-emerald-700 border-emerald-500/20"
                            : "bg-amber-50/10 text-amber-700 border-amber-500/20"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Expenses List */}
        <GlassCard className="p-6 border-white/60 bg-white/40 space-y-4">
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-purple-royal">
              Business Expense Logbook
            </h4>
            <p className="text-[10px] text-charcoal-dark/50">
              Operational costs (diesel purchase, florists advance payments)
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-purple-royal/15 font-bold text-purple-royal/80 pb-2">
                  <th className="py-2.5">Category</th>
                  <th className="py-2.5">Payee</th>
                  <th className="py-2.5">Description</th>
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-royal/5">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-purple-royal/[0.02]">
                    <td className="py-3 font-bold text-purple-royal">{exp.category}</td>
                    <td className="py-3 font-semibold">{exp.payee}</td>
                    <td className="py-3 text-charcoal-dark/60 max-w-[120px] truncate" title={exp.description}>
                      {exp.description}
                    </td>
                    <td className="py-3 text-charcoal-dark/50">{exp.date}</td>
                    <td className="py-3 text-right font-bold text-rose-600">
                      ₹{exp.amount.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default FinanceView;

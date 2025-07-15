'use client';
import { useState } from "react";

const compBands = ["10.00-19.99", "20.00-29.99", "30.00-39.99", "40.00-49.99", "50.00-59.99",
  "60.00-69.99", "70.00-79.99", "80.00-89.99", "90.00-99.99", "100.00-109.99",
  "110.00-119.99", "120.00-129.99", "130.00-139.99", "140.00-149.99",
  "150.00-159.99", "160.00-169.99", "170.00-179.99", "180.00-189.99", "190.00-200.00"];

const programs = ["CONV", "HIBAL", "Jumbo", "FHA", "VA", "RENO"];

const multipliers = {
  "20.00-29.99": { CONV: 10.506, HIBAL: 10.44, Jumbo: 10.44, FHA: 20.471, VA: 19.792, RENO: 23.055 },
  "150.00-159.99": { CONV: 2.066, HIBAL: 1.667, Jumbo: 1.667, FHA: 3.205, VA: 3.030, RENO: 3.906 }
};

export default function Home() {
  const [loanAmount, setLoanAmount] = useState(2000000);
  const [compBand, setCompBand] = useState('');
  const [program, setProgram] = useState('');
  const [loCompBPS, setLoCompBPS] = useState(130);
  const [fees, setFees] = useState(1595);
  const [maxComp, setMaxComp] = useState('');
  const [expenses, setExpenses] = useState({ fulfillment: 1800, corp: 650, origination: 600 });

  const multiplier = multipliers[compBand]?.[program] || 0;
  const totalBPS = multiplier * 20;
  const grossRevenue = loanAmount * totalBPS / 10000;
  const grossPlusFees = grossRevenue + parseFloat(fees);
  const loCompDollar = loanAmount * loCompBPS / 10000;
  const maxCompValue = parseFloat(maxComp);
  const addBack = maxCompValue && loCompDollar > maxCompValue ? loCompDollar - maxCompValue : 0;
  const effectiveComp = maxCompValue && loCompDollar > maxCompValue ? maxCompValue : loCompDollar;
  const netRevenueBeforeExpenses = grossPlusFees - effectiveComp + addBack;
  const totalExpenses = expenses.fulfillment + expenses.corp + expenses.origination;
  const netRevenueAfterExpenses = netRevenueBeforeExpenses - totalExpenses;
  const netMarginBPS = (netRevenueAfterExpenses / loanAmount).toFixed(4);

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold">LO Comp Calculator</h1>
      <div className="grid gap-2">
        <input type="number" value={loanAmount} onChange={e => setLoanAmount(+e.target.value)} placeholder="Loan Amount" className="border rounded px-2 py-1" />
        <select value={compBand} onChange={e => setCompBand(e.target.value)} className="border rounded px-2 py-1">
          <option value="">Select Comp Band</option>
          {compBands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select value={program} onChange={e => setProgram(e.target.value)} className="border rounded px-2 py-1">
          <option value="">Select Program</option>
          {programs.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <input type="number" value={loCompBPS} onChange={e => setLoCompBPS(+e.target.value)} placeholder="LO Comp BPS" className="border rounded px-2 py-1" />
        <input type="number" value={fees} onChange={e => setFees(+e.target.value)} placeholder="Fees Collected" className="border rounded px-2 py-1" />
        <input type="number" value={maxComp} onChange={e => setMaxComp(e.target.value)} placeholder="LO Max Comp (Optional)" className="border rounded px-2 py-1" />
        <input type="number" value={expenses.fulfillment} onChange={e => setExpenses({ ...expenses, fulfillment: +e.target.value })} placeholder="Fulfillment" className="border rounded px-2 py-1" />
        <input type="number" value={expenses.corp} onChange={e => setExpenses({ ...expenses, corp: +e.target.value })} placeholder="Corp Allocation" className="border rounded px-2 py-1" />
        <input type="number" value={expenses.origination} onChange={e => setExpenses({ ...expenses, origination: +e.target.value })} placeholder="Origination Expense" className="border rounded px-2 py-1" />
      </div>

      <div className="bg-gray-100 p-4 rounded space-y-1 text-sm">
        <div><strong>Multiplier:</strong> {multiplier}</div>
        <div><strong>Total BPS:</strong> {totalBPS.toFixed(2)}</div>
        <div><strong>Gross Revenue:</strong> ${grossRevenue.toLocaleString()}</div>
        <div><strong>LO Comp ($):</strong> ${loCompDollar.toLocaleString()}</div>
        <div><strong>LO Addback ($):</strong> ${addBack.toLocaleString()}</div>
        <div><strong>Net Revenue Before Expenses:</strong> ${netRevenueBeforeExpenses.toLocaleString()}</div>
        <div><strong>Net Revenue After Expenses:</strong> ${netRevenueAfterExpenses.toLocaleString()}</div>
        <div><strong>Net Margin:</strong> {(netMarginBPS * 10000).toFixed(2)} BPS</div>
      </div>
    </main>
  );
}
import { useAuth } from "../context/AuthContext.jsx";

// Shell only. Anukrati plugs her components in below (summary card,
// subscriptions list, transactions table, upload page).
export default function Dashboard() {
  const { user } = useAuth();

  return (
    <>
      <h1 className="page__title">{user?.name ? `Hi, ${user.name.split(" ")[0]}` : "Dashboard"}</h1>
      <p className="page__sub">Your monthly spend and upcoming renewals will appear here.</p>

      {/* SRS FR-7.6: explanatory empty state until data is ingested */}
      <div className="empty">
        <h2>Nothing to show yet</h2>
        <p>Upload a bank statement CSV to find your subscriptions. Gmail receipts can be connected later.</p>
      </div>

      {/* <SummaryCard /> <SubscriptionsList /> <TransactionsTable /> */}
    </>
  );
}

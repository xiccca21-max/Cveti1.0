import { Route, Routes } from "react-router-dom";
import { SubPageLayout } from "./layout/SubPageLayout";
import AdminPage from "./pages/admin/AdminPage";
import { BouquetsPage } from "./pages/BouquetsPage";
import { CatalogPage } from "./pages/CatalogPage";
import { ContactsPage } from "./pages/ContactsPage";
import { HomePage } from "./pages/HomePage";
import { OptPage } from "./pages/OptPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route element={<SubPageLayout />}>
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="bouquets" element={<BouquetsPage />} />
        <Route path="opt" element={<OptPage />} />
        <Route path="contacts" element={<ContactsPage />} />
      </Route>
    </Routes>
  );
}

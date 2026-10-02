import { getFooterData } from "@/lib/public-data";
import { FooterSettingsForm } from "@/components/footer-settings-form";

export default async function FooterSettingsPage() {
  const footer = await getFooterData();
  return (
    <div className="admin-page">
      <header className="admin-page-heading"><div><h1>تنظیمات فوتر سایت</h1><p>محتوای فوتر سراسری گروه کسب‌وکار نگاه خلاق را مدیریت کنید.</p></div></header>
      <div className="admin-alert info">تغییرات این صفحه در فوتر سراسری همهٔ صفحات سایت نمایش داده می‌شود.</div>
      <FooterSettingsForm initialValue={footer} />
    </div>
  );
}

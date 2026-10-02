import { MessagesManager } from "@/components/messages-manager";

export default function MessagesAdminPage() {
  return <div className="admin-page"><header className="admin-page-heading"><div><h1>پیام‌های تماس</h1><p>پیام‌های ارسال‌شده از فرم تماس سایت.</p></div></header><MessagesManager /></div>;
}

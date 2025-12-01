import { useAtomValue } from 'jotai';
import { Toast } from '../ui/Toast';
import { Header } from './Header';
import { CartPage } from '../pages/CartPage';
import { AdminPage } from '../features/admin/AdminPage';
import { isAdminAtom } from '../../atoms/adminAtoms';

// 페이지 레이아웃 컴포넌트 (Header, Toast, 조건부 렌더링 담당)
export const PagesLayout = () => {
  const isAdmin = useAtomValue(isAdminAtom);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast />
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage />
        ) : (
          <CartPage />
        )}
      </main>
    </div>
  );
};


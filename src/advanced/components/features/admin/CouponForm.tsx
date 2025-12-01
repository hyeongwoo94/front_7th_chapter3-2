import { useAtom, useSetAtom, useAtomValue } from 'jotai';
import { Input } from '../../ui/Input';
import { MAX_DISCOUNT_AMOUNT, MAX_DISCOUNT_PERCENTAGE } from '../../../constants';
import { couponFormAtom, resetCouponFormAtom } from '../../../atoms/adminAtoms';
import { couponsAtom, couponsWithStorageAtom } from '../../../atoms/adminAtoms';
import { addNotificationAtom } from '../../../atoms/notificationAtoms';
import { Coupon } from '../../../../types';

// 쿠폰 추가 폼 컴포넌트
export const CouponForm = () => {
  const [couponForm, setCouponForm] = useAtom(couponFormAtom);
  const coupons = useAtomValue(couponsAtom);
  const setCoupons = useSetAtom(couponsWithStorageAtom);
  const resetCouponForm = useSetAtom(resetCouponFormAtom);
  const addNotification = useSetAtom(addNotificationAtom);

  const handleFormChange = (updates: Partial<typeof couponForm>) => {
    setCouponForm({ ...couponForm, ...updates });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const existingCoupon = coupons.find(c => c.code === couponForm.code);
    if (existingCoupon) {
      addNotification('이미 존재하는 쿠폰 코드입니다.', 'error');
      return;
    }
    const coupon: Coupon = {
      name: couponForm.name,
      code: couponForm.code,
      discountType: couponForm.discountType,
      discountValue: couponForm.discountValue
    };
    const newCoupons = [...coupons, coupon];
    setCoupons(newCoupons);
    addNotification('쿠폰이 추가되었습니다.', 'success');
    resetCouponForm();
  };
  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">새 쿠폰 생성</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">쿠폰명</label>
            <Input
              type="text"
              value={couponForm.name}
              onChange={(e) => handleFormChange({ name: e.target.value })}
              placeholder="신규 가입 쿠폰"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">쿠폰 코드</label>
            <Input
              type="text"
              value={couponForm.code}
              onChange={(e) => handleFormChange({ code: e.target.value.toUpperCase() })}
              placeholder="WELCOME2024"
              className="font-mono"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">할인 타입</label>
            <select
              value={couponForm.discountType}
              onChange={(e) => handleFormChange({ 
                discountType: e.target.value as 'amount' | 'percentage' 
              })}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
            >
              <option value="amount">정액 할인</option>
              <option value="percentage">정률 할인</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {couponForm.discountType === 'amount' ? '할인 금액' : '할인율(%)'}
            </label>
            <Input
              type="text"
              value={couponForm.discountValue === 0 ? '' : couponForm.discountValue}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d+$/.test(value)) {
                  handleFormChange({ discountValue: value === '' ? 0 : parseInt(value) });
                }
              }}
              onBlur={(e) => {
                const value = parseInt(e.target.value) || 0;
                if (couponForm.discountType === 'percentage') {
                  if (value > MAX_DISCOUNT_PERCENTAGE) {
                    addNotification(`할인율은 ${MAX_DISCOUNT_PERCENTAGE}%를 초과할 수 없습니다`, 'error');
                    handleFormChange({ discountValue: MAX_DISCOUNT_PERCENTAGE });
                  } else if (value < 0) {
                    handleFormChange({ discountValue: 0 });
                  }
                } else {
                  if (value > MAX_DISCOUNT_AMOUNT) {
                    addNotification(`할인 금액은 ${MAX_DISCOUNT_AMOUNT.toLocaleString()}원을 초과할 수 없습니다`, 'error');
                    handleFormChange({ discountValue: MAX_DISCOUNT_AMOUNT });
                  } else if (value < 0) {
                    handleFormChange({ discountValue: 0 });
                  }
                }
              }}
              placeholder={couponForm.discountType === 'amount' ? '5000' : '10'}
              required
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => resetCouponForm()}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            쿠폰 생성
          </button>
        </div>
      </form>
    </div>
  );
};


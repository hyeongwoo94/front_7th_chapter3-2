import { useAtomValue, useSetAtom } from 'jotai';
import { Coupon } from '../../../../types';
import { couponsAtom } from '../../../atoms/adminAtoms';
import { selectedCouponAtom, setSelectedCouponAtom, applyCouponAtom } from '../../../atoms/cartAtoms';
import { addNotificationAtom } from '../../../atoms/notificationAtoms';

// 쿠폰 선택 드롭다운 컴포넌트
export const CouponSelector = () => {
  const coupons = useAtomValue(couponsAtom);
  const selectedCoupon = useAtomValue(selectedCouponAtom);
  const applyCoupon = useSetAtom(applyCouponAtom);
  const setSelectedCoupon = useSetAtom(setSelectedCouponAtom);
  const addNotification = useSetAtom(addNotificationAtom);

  const handleSelect = (coupon: Coupon) => {
    const result = applyCoupon(coupon);
    if (result && result.success) {
      addNotification(result.message || '쿠폰이 적용되었습니다.', 'success');
    } else if (result && !result.success) {
      addNotification(result.message || '쿠폰 적용에 실패했습니다.', 'error');
    }
  };

  const handleClear = () => {
    setSelectedCoupon(null);
  };
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">쿠폰 할인</h3>
        <button className="text-xs text-blue-600 hover:underline">
          쿠폰 등록
        </button>
      </div>
      {coupons.length > 0 && (
        <select 
          className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          value={selectedCoupon?.code || ''}
          onChange={(e) => {
            const coupon = coupons.find(c => c.code === e.target.value);
            if (coupon) {
              handleSelect(coupon);
            } else {
              handleClear();
            }
          }}
        >
          <option value="">쿠폰 선택</option>
          {coupons.map(coupon => (
            <option key={coupon.code} value={coupon.code}>
              {coupon.name} ({coupon.discountType === 'amount' 
                ? `${coupon.discountValue.toLocaleString()}원` 
                : `${coupon.discountValue}%`})
            </option>
          ))}
        </select>
      )}
    </>
  );
};


import { Coupon } from '../../../../types';

interface CouponSelectorProps {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  onSelect: (coupon: Coupon) => void;
  onClear: () => void;
}

// 쿠폰 선택 드롭다운 컴포넌트
export const CouponSelector = ({
  coupons,
  selectedCoupon,
  onSelect,
  onClear
}: CouponSelectorProps) => {
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
              onSelect(coupon);
            } else {
              onClear();
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


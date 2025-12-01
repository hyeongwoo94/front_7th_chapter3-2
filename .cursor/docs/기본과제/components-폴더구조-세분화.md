# Components 폴더 구조 세분화 가이드

이 문서는 `src/basic/components` 폴더의 구조를 기능별로 세분화하는 가이드를 제공합니다.

---

## 📋 목차

1. [현재 구조](#현재-구조)
2. [구조 변경 이유](#구조-변경-이유)
3. [폴더별 설명](#폴더별-설명)
4. [Import 경로 가이드](#import-경로-가이드)
5. [주요 원칙](#주요-원칙)

---

## 현재 구조

```
src/basic/components/
├── pages/                    # 페이지 컴포넌트
│   └── CartPage.tsx         # 쇼핑몰 메인 페이지 (상품 목록 + 장바구니)
├── layout/                   # 레이아웃 컴포넌트
│   └── Header.tsx           # 헤더 (검색, 장바구니 아이콘, 관리자 전환)
├── features/                 # 기능별 컴포넌트 (엔티티 기반)
│   ├── product/             # 상품 기능
│   │   ├── ProductCard.tsx  # 상품 카드
│   │   ├── ProductList.tsx  # 상품 목록 섹션
│   │   └── SearchBar.tsx    # 검색 입력
│   ├── cart/                # 장바구니 기능
│   │   ├── Cart.tsx         # 장바구니 섹션
│   │   └── CartItem.tsx     # 장바구니 아이템
│   ├── coupon/              # 쿠폰 기능
│   │   ├── CouponCard.tsx   # 쿠폰 카드
│   │   └── CouponSelector.tsx # 쿠폰 선택 드롭다운
│   └── admin/               # 관리자 기능
│       ├── AdminPage.tsx    # 관리자 페이지
│       ├── ProductManagement.tsx # 상품 관리 섹션
│       ├── ProductForm.tsx  # 상품 추가/수정 폼
│       ├── CouponManagement.tsx # 쿠폰 관리 섹션
│       ├── CouponForm.tsx   # 쿠폰 추가 폼
│       ├── TabNavigation.tsx # 탭 네비게이션
│       └── types.ts         # 관리자 관련 타입 정의
├── ui/                      # 범용 UI 컴포넌트
│   ├── Button.tsx           # 재사용 가능한 버튼
│   ├── Input.tsx            # 재사용 가능한 입력 필드
│   └── Toast.tsx            # 알림 토스트
└── icons/                   # 아이콘 컴포넌트
    └── index.tsx            # SVG 아이콘 모음
```

**구조 특징**:
- ✅ 기능별로 명확히 분리됨
- ✅ 엔티티 기반 아키텍처와 일치
- ✅ 페이지, 레이아웃, 기능 컴포넌트가 명확히 구분됨
- ✅ 확장 가능한 구조

---

## 구조 변경 이유

### 1. 기능별 그룹화
- **장점**: 관련 컴포넌트들이 한 곳에 모여 있어 찾기 쉬움
- **예시**: 상품 관련 컴포넌트(`ProductCard`, `ProductList`, `SearchBar`)가 `features/product/`에 함께 위치

### 2. 엔티티 기반 분리
- **장점**: 엔티티별로 명확히 분리되어 아키텍처 원칙과 일치
- **예시**: 
  - `features/product/` - Product 엔티티 관련
  - `features/cart/` - Cart 엔티티 관련
  - `features/coupon/` - Coupon 엔티티 관련
  - `features/admin/` - 관리자 기능 (여러 엔티티 관리)

### 3. 확장성
- **장점**: 새로운 기능 추가 시 해당 폴더에만 추가하면 됨
- **예시**: 주문 기능 추가 시 `features/order/` 폴더만 추가

### 4. 레이아웃 분리
- **장점**: 레이아웃 컴포넌트와 기능 컴포넌트를 명확히 구분
- **예시**: `Header`는 레이아웃이므로 `layout/`에 위치

### 5. 페이지 컴포넌트 분리
- **장점**: 여러 기능을 조합한 페이지 컴포넌트를 별도로 관리
- **예시**: `CartPage`는 상품 목록과 장바구니를 조합한 페이지이므로 `pages/`에 위치

### 6. 명확한 책임 분리
- **장점**: 각 폴더의 역할이 명확함
  - `pages/`: 페이지 컴포넌트 (여러 기능 조합)
  - `layout/`: 레이아웃 컴포넌트
  - `features/`: 비즈니스 기능 컴포넌트
  - `ui/`: 범용 UI 컴포넌트
  - `icons/`: 아이콘 컴포넌트

---

## 폴더별 설명

### `components/pages/`
**역할**: 여러 기능을 조합한 페이지 컴포넌트

**특징**:
- 여러 features 컴포넌트를 조합
- 페이지 단위의 레이아웃 구성
- 라우팅과 연관될 수 있음

**컴포넌트**:
- `CartPage.tsx` - 쇼핑몰 메인 페이지 (상품 목록 + 장바구니)

**의존성**:
- `features/product/ProductList`
- `features/cart/Cart`
- `hooks/useProducts`
- `hooks/useCart`
- `hooks/useCoupons`

---

### `components/layout/`
**역할**: 레이아웃 관련 컴포넌트

**특징**:
- 페이지 구조를 담당
- 여러 기능을 조합하여 레이아웃 구성
- 전역적으로 사용되는 컴포넌트

**컴포넌트**:
- `Header.tsx` - 헤더 (검색, 장바구니 아이콘, 관리자 전환)

**의존성**:
- `features/product/SearchBar`
- `components/icons`
- `components/ui/Button`

---

### `components/features/`
**역할**: 비즈니스 기능별 컴포넌트

**특징**:
- 엔티티 기반으로 분리
- 각 폴더는 하나의 기능/엔티티를 담당
- 관련 컴포넌트들이 함께 위치

#### `features/product/`
**역할**: 상품 관련 컴포넌트

**컴포넌트**:
- `ProductCard.tsx` - 상품 카드 (개별 상품 표시)
- `ProductList.tsx` - 상품 목록 섹션 (상품 목록 표시)
- `SearchBar.tsx` - 검색 입력 컴포넌트

**의존성**:
- `hooks/useProducts.ts`
- `models/product.ts`
- `components/ui/Button`
- `components/icons`

#### `features/cart/`
**역할**: 장바구니 관련 컴포넌트

**컴포넌트**:
- `Cart.tsx` - 장바구니 섹션 (장바구니 전체 관리)
- `CartItem.tsx` - 장바구니 아이템 (개별 아이템 표시)

**의존성**:
- `hooks/useCart.ts`
- `models/cart.ts`
- `components/ui/Button`
- `components/icons`
- `features/coupon/CouponSelector`

#### `features/coupon/`
**역할**: 쿠폰 관련 컴포넌트

**컴포넌트**:
- `CouponCard.tsx` - 쿠폰 카드 (개별 쿠폰 표시)
- `CouponSelector.tsx` - 쿠폰 선택 드롭다운

**의존성**:
- `hooks/useCoupons.ts`
- `models/coupon.ts`
- `components/icons`

#### `features/admin/`
**역할**: 관리자 기능 관련 컴포넌트

**컴포넌트**:
- `AdminPage.tsx` - 관리자 페이지 (메인 컨테이너)
- `ProductManagement.tsx` - 상품 관리 섹션
- `ProductForm.tsx` - 상품 추가/수정 폼
- `CouponManagement.tsx` - 쿠폰 관리 섹션
- `CouponForm.tsx` - 쿠폰 추가 폼
- `TabNavigation.tsx` - 탭 네비게이션
- `types.ts` - 관리자 관련 타입 정의 (`ProductFormData`, `CouponFormData`, `AdminTab`)

**의존성**:
- `hooks/useProducts.ts`
- `hooks/useCoupons.ts`
- `components/ui/Button`
- `components/ui/Input`
- `components/icons`
- `features/coupon/CouponCard`

---

### `components/ui/`
**역할**: 범용적이고 재사용 가능한 UI 컴포넌트

**특징**:
- 엔티티를 모름
- 비즈니스 로직 없음
- 어떤 프로젝트에서도 사용 가능

**컴포넌트**:
- `Button.tsx` - 재사용 가능한 버튼 컴포넌트
- `Input.tsx` - 재사용 가능한 입력 필드 컴포넌트
- `Toast.tsx` - 알림 토스트 컴포넌트

**의존성**:
- 없음 (순수 UI 컴포넌트)

---

### `components/icons/`
**역할**: SVG 아이콘 컴포넌트

**특징**:
- 재사용 가능한 SVG 아이콘
- `className`, `strokeWidth` 등 props로 커스터마이징 가능

**컴포넌트**:
- `index.tsx` - 아이콘 모음
  - `CartIcon` - 장바구니 아이콘
  - `CartIconSimple` - 간단한 장바구니 아이콘
  - `CloseIcon` - 닫기 아이콘
  - `TrashIcon` - 삭제 아이콘
  - `ImageIcon` - 이미지 아이콘
  - `PlusIcon` - 더하기 아이콘
  - `MinusIcon` - 빼기 아이콘

**의존성**:
- 없음 (순수 SVG 컴포넌트)

---

## Import 경로 가이드

### 페이지 컴포넌트에서
```typescript
// pages/CartPage.tsx
import { ProductList } from '../features/product/ProductList';
import { Cart } from '../features/cart/Cart';
import { useProducts } from '../../hooks/useProducts';
```

### 레이아웃 컴포넌트에서
```typescript
// layout/Header.tsx
import { SearchBar } from '../features/product/SearchBar';
import { Button } from '../ui/Button';
import { CartIcon } from '../icons';
```

### Features 컴포넌트에서
```typescript
// features/cart/Cart.tsx
import { CartItem } from './CartItem';
import { CouponSelector } from '../coupon/CouponSelector';
import { Button } from '../../ui/Button';
import { CartIconSimple } from '../../icons';
```

### Features 컴포넌트 간 참조
```typescript
// features/cart/Cart.tsx
import { CouponSelector } from '../coupon/CouponSelector'; // ✅ 다른 feature 참조

// features/admin/AdminPage.tsx
import { ProductManagement } from './ProductManagement'; // ✅ 같은 feature 내부
```

### UI 컴포넌트 사용
```typescript
// 어디서든
import { Button } from '../ui/Button'; // 또는 '../../ui/Button' 등
import { Input } from '../ui/Input';
```

### 아이콘 사용
```typescript
// 어디서든
import { CartIcon, CloseIcon } from '../icons'; // 또는 '../../icons' 등
```

---

## 주요 원칙

### ✅ 해야 할 것

1. **상대 경로 사용**
   ```typescript
   // ✅ 좋은 예: 같은 폴더 내
   import { CartItem } from './CartItem';
   
   // ✅ 좋은 예: 다른 features 폴더
   import { CouponSelector } from '../coupon/CouponSelector';
   
   // ✅ 좋은 예: ui 폴더
   import { Button } from '../../ui/Button';
   ```

2. **명확한 폴더 구조 유지**
   - 페이지 컴포넌트는 `pages/`에
   - 레이아웃 컴포넌트는 `layout/`에
   - 기능 컴포넌트는 `features/`에
   - 범용 UI는 `ui/`에

3. **타입 정의는 해당 폴더에**
   ```typescript
   // features/admin/types.ts
   export interface ProductFormData { ... }
   export interface CouponFormData { ... }
   ```

### ❌ 하지 말아야 할 것

1. **순환 의존성**
   ```typescript
   // ❌ 나쁜 예: 순환 의존성
   // features/cart/Cart.tsx
   import { ProductCard } from '../product/ProductCard';
   
   // features/product/ProductCard.tsx
   import { Cart } from '../cart/Cart';
   ```

2. **과도한 깊이**
   ```typescript
   // ❌ 나쁜 예: 너무 깊은 폴더 구조
   features/product/list/card/ProductCard.tsx
   
   // ✅ 좋은 예: 적절한 깊이
   features/product/ProductCard.tsx
   ```

3. **비즈니스 로직을 UI 컴포넌트에 포함**
   ```typescript
   // ❌ 나쁜 예
   // ui/Button.tsx
   const Button = () => {
     const { addToCart } = useCart(); // ❌ 비즈니스 로직
     ...
   }
   
   // ✅ 좋은 예
   // ui/Button.tsx
   const Button = ({ onClick, children, ... }) => { // ✅ props로 전달
     return <button onClick={onClick}>{children}</button>;
   }
   ```

---

## 컴포넌트 계층 구조

```
App.tsx
├── Header (layout/)
├── CartPage (pages/)
│   ├── ProductList (features/product/)
│   │   └── ProductCard (features/product/)
│   └── Cart (features/cart/)
│       ├── CartItem (features/cart/)
│       └── CouponSelector (features/coupon/)
│           └── CouponCard (features/coupon/)
└── AdminPage (features/admin/)
    ├── TabNavigation (features/admin/)
    ├── ProductManagement (features/admin/)
    │   └── ProductForm (features/admin/)
    └── CouponManagement (features/admin/)
        └── CouponForm (features/admin/)
```

---

## 관련 문서

- `components-명세서.md`: 컴포넌트 구현 명세서
- `리팩토링-실행순서.md`: 리팩토링 전체 프로세스
- `hooks-명세서.md`: Hooks 구현 명세서

---

**마지막 업데이트**: 2025-12-01

# Utils Hooks 폴더 가이드

이 폴더는 **재사용 가능한 유틸리티 Hook**을 포함합니다.

---

## 📋 목차

1. [Utils Hooks 폴더란?](#utils-hooks-폴더란)
2. [Hooks 폴더와의 차이](#hooks-폴더와의-차이)
3. [파일 구조](#파일-구조)
4. [각 Hook 상세 설명](#각-hook-상세-설명)

---

## Utils Hooks 폴더란?

### 역할
- **재사용 가능한 유틸리티 Hook 제공**
- **비즈니스 로직과 무관한 기술적 도구**
- **UI 최적화 및 일반적인 기능 제공**

### 특징
- ✅ 비즈니스 도메인 데이터를 다루지 않음
- ✅ 범용적으로 사용 가능한 Hook
- ✅ 다른 프로젝트에서도 재사용 가능
- ✅ React Hook 규칙 준수

---

## Hooks 폴더와의 차이

### `hooks/` 폴더 (비즈니스 로직 Hook)
- **역할**: 비즈니스 도메인 데이터(엔티티)를 다루는 Hook
- **예시**: `useCart`, `useProducts`, `useCoupons`
- **특징**: Models의 순수함수를 활용하여 비즈니스 로직 구현

### `utils/hooks/` 폴더 (유틸리티 Hook)
- **역할**: 비즈니스 로직과 무관한 기술적 도구 Hook
- **예시**: `useDebounce`, `useLocalStorage`, `useValidate`
- **특징**: 범용적으로 사용 가능한 유틸리티

### 비교표

| 구분 | `hooks/` | `utils/hooks/` |
|------|---------|----------------|
| **목적** | 비즈니스 로직 관리 | 기술적 유틸리티 제공 |
| **도메인** | 특정 비즈니스 도메인 (쇼핑몰) | 범용적 (어떤 프로젝트든 사용 가능) |
| **의존성** | Models, Constants | Constants만 사용 |
| **재사용성** | 프로젝트 특화 | 범용적 |

---

## 파일 구조

```
src/basic/utils/hooks/
└── useDebounce.ts     # 디바운스 유틸리티 Hook
```

---

## 각 Hook 상세 설명

### 📦 `useDebounce` - 디바운스 유틸리티 Hook

#### 목적
입력값 디바운스 처리 (검색어 등)

#### 사용하는 Constants
```typescript
import { DEBOUNCE_DELAY } from '../../constants';
```

#### 파라미터
- `value: T` - 디바운스할 값
- `delay: number` - 지연 시간 (기본값: `DEBOUNCE_DELAY`)

#### 반환값
디바운스된 값

#### 사용 예시
```typescript
import { useState } from 'react';
import { useDebounce } from './utils/hooks/useDebounce';
import { useProducts } from './hooks/useProducts';

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);
  const { filteredProducts } = useProducts(debouncedSearchTerm);

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="상품 검색..."
      />
      {filteredProducts.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
};
```

#### 동작 원리
1. `value`가 변경되면 타이머 시작
2. `delay` 시간 동안 `value`가 다시 변경되지 않으면 최종 값 반환
3. `delay` 시간 내에 `value`가 다시 변경되면 타이머 리셋

#### 왜 필요한가?
- **성능 최적화**: 검색어 입력 시 매번 필터링하지 않고, 입력이 끝난 후에만 필터링
- **API 호출 최소화**: 검색 API 호출 횟수 감소
- **사용자 경험 개선**: 불필요한 렌더링 방지

---

## 아키텍처 계층 구조

```
┌─────────────────┐
│   Components    │  ← UI 렌더링만 담당
└────────┬────────┘
         │ 사용
┌────────▼────────┐
│  hooks/         │  ← 비즈니스 로직 Hook
│  (비즈니스)     │
└────────┬────────┘
         │ 사용
┌────────▼────────┐
│  utils/hooks/   │  ← 유틸리티 Hook
│  (기술적 도구)  │
└─────────────────┘
```

---

## 주의사항

### ✅ 해야 할 것

1. **범용적으로 사용 가능하도록 설계**
   ```typescript
   // ✅ 좋은 예: 제네릭 타입 사용
   export const useDebounce = <T,>(value: T, delay: number): T => {
     // ...
   };
   ```

2. **비즈니스 로직과 분리**
   ```typescript
   // ✅ 좋은 예: 유틸리티 Hook은 비즈니스 로직 없음
   export const useDebounce = <T,>(value: T, delay: number): T => {
     // 단순히 입력값을 지연시키는 기술적 도구
   };
   ```

### ❌ 하지 말아야 할 것

1. **비즈니스 로직 포함**
   ```typescript
   // ❌ 나쁜 예: 비즈니스 로직 포함
   export const useDebounce = (searchTerm: string) => {
     // 상품 필터링 로직 포함 (비즈니스 로직)
     const filtered = products.filter(...);
     return filtered;
   };
   
   // ✅ 좋은 예: 순수 유틸리티
   export const useDebounce = <T,>(value: T, delay: number): T => {
     // 단순히 값만 지연
   };
   ```

2. **Models 함수 사용**
   ```typescript
   // ❌ 나쁜 예: Models 함수 사용
   import { filterProducts } from '../../models/product';
   
   // ✅ 좋은 예: Models 함수 사용 안 함
   // 유틸리티 Hook은 비즈니스 로직과 무관
   ```

---

## 관련 문서

- `../../hooks/README.md`: 비즈니스 로직 Hook 가이드
- `../../models/README.md`: Models 폴더 가이드
- `.cursor/docs/리팩토링-실행순서.md`: 리팩토링 전체 프로세스

---

**마지막 업데이트**: 2025-12-01


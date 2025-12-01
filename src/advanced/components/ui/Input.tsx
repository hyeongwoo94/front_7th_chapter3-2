interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // 기본 HTML input 속성을 모두 상속받음
  // 추가적으로 필요한 props 정의 가능
}

// 재사용 가능한 입력 필드 컴포넌트
export const Input = ({ className = '', ...props }: InputProps) => {
  return (
    <input
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${className}`}
      {...props}
    />
  );
};


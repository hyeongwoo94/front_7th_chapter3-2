/**
 * Button 컴포넌트
 * 
 * 주의: 현재 프로젝트에서는 origin 스타일과의 일관성을 위해
 * 대부분의 버튼을 일반 button 태그로 직접 사용합니다.
 * 
 * 이 컴포넌트는 정말 재사용이 필요한 특수한 경우에만 사용하세요.
 * 일반적으로는 직접 className을 사용하는 것을 권장합니다.
 */

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

// 재사용 가능한 버튼 컴포넌트 (특수한 경우에만 사용)
export const Button = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  type = 'button',
  className = ''
}: ButtonProps) => {
  const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors';
  const variantStyles = {
    primary: 'bg-gray-900 text-white hover:bg-gray-800',
    secondary: 'bg-gray-100 text-gray-400 cursor-not-allowed',
    danger: 'text-red-600 hover:text-red-900'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {children}
    </button>
  );
};

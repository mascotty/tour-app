// 需要“登录后才能访问”的页面，你可以将这段逻辑抽成一个 useAuthGuard 自定义 Hook，实现更优雅的复用
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuthGuard = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
        }
    }, []);
};


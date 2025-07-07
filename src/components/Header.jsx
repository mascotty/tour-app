import { Menu, Dropdown, message } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            setUser(JSON.parse(stored));
        } else {
            setUser(null);
        }
    }, [location.pathname]); // 每次页面路径变化时检查用户状态

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        message.success('您已退出登录');
        navigate('/login');
    };

    const menuItems = [
        { key: '/', label: <Link to="/">首页</Link> },
        { key: '/tours', label: <Link to="/tours">旅游线路</Link> },
        { key: '/favorite', label: <Link to="/favorite">我的收藏</Link> },
    ];

    // 登录状态菜单项
    const authMenu =
        user ? (
            <Dropdown
                menu={{
                    items: [
                        { key: 'username', label: `👤 ${user.username}`, disabled: true },
                        { type: 'divider' },
                        { key: 'logout', label: <span onClick={handleLogout}>退出登录</span> },
                    ],
                }}
                placement="bottomRight"
            >
                <span style={{ color: '#fff', cursor: 'pointer', marginLeft: 20 }}>
                    欢迎，{user.username}
                </span>
            </Dropdown>
        ) : (
            <span style={{ marginLeft: 20 }}>
                <Link to="/register" style={{ color: '#fff' }}>登录 / 注册</Link>
            </span>
        );

    return (
        <div style={{ background: '#001529', padding: '0 50px', display: 'flex', alignItems: 'center', height: 64 }}>
            <Menu
                theme="dark"
                mode="horizontal"
                selectedKeys={[location.pathname]}
                items={menuItems}
                style={{ flex: 1 }}
            />
            {authMenu}
        </div>
    );
};

export default Header;

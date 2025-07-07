import { Button } from 'antd';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div
            style={{
                height: '80vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
            }}
        >
            <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>404</h1>
            <p style={{ fontSize: '18px', marginBottom: '24px' }}>
                抱歉，您访问的页面不存在。
            </p>
            <Link to="/">
                <Button type="primary">返回首页</Button>
            </Link>
        </div>
    );
};

export default NotFound;

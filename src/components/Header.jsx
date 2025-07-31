// import { Avatar, Menu, Dropdown, message, Tooltip, Button, Upload } from 'antd';
// import { UserOutlined } from '@ant-design/icons';

// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
// const api = import.meta.env.VITE_API_BASE;

// const Header = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const [user, setUser] = useState(null);
//     const [avatarUrl, setAvatarUrl] = useState(null); //设置头像链接
//     const [avatarVersion, setAvatarVersion] = useState(Date.now());//这块是一个时间戳，用来更新头像的问题，头像上传成功但组件未立即更新渲染，这通常是因为 Avatar 组件使用了旧的缓存图片。即使你设置了新的 avatarUrl，浏览器仍然加载了旧缓存的图片资源。
//     //解决方案：添加时间戳避免缓存  (在头像 URL 后面拼接一个 唯一查询参数（例如时间戳），强制浏览器重新拉取新图片：)

//     const uploadRef = useRef();


//     useEffect(() => {
//         const stored = localStorage.getItem('user');
//         if (stored) {
//             setUser(JSON.parse(stored));
//             setAvatarUrl(JSON.parse(stored).avatar); // 预设头像字段
//         } else {
//             setUser(null);
//         }
//     }, [location.pathname]); // 每次页面路径变化时检查用户状态

//     const handleLogout = () => {
//         localStorage.removeItem('user');
//         setUser(null);
//         setAvatarUrl(null);
//         message.success('您已退出登录');
//         navigate('/login');
//     };

//     const handleUpload = async (file) => { //上传头像用
//         const formData = new FormData();
//         formData.append('file', file);
//         formData.append('username', user.username);

//         try {
//             const res = await axios.post(`${api}/upload-avatar`, formData);
//             if (res.data.success) {
//                 setAvatarUrl(res.data.url);
//                 const updatedUser = { ...user, avatar: res.data.url };
//                 setUser(updatedUser);
//                 localStorage.setItem('user', JSON.stringify(updatedUser));
//                 message.success('头像上传成功');
//                 console.log("上传头像成功！")
//                 console.log("返回的头像地址:", res.data.url);
//                 setAvatarVersion(Date.now());   //确保只有在上传成功之后，才更新 URL，从而既避免缓存问题，又防止重复请求头像资源。


//             }
//         } catch (err) {
//             message.error('上传失败');
//             console.log("上传头像失败！")

//         }

//         return false;
//     };

//     const menuItems = [
//         { key: '/', label: <Link to="/">首页</Link> },
//         { key: '/tours', label: <Link to="/tours">旅游线路</Link> },
//         // { user && { key: '/add-tour', label: <Link to="/add-tour">添加游记</Link> }},
//         { key: '/add-tour', label: <Link to="/add-tour">添加游记</Link> },//这行用来上传图片
//         { key: '/favorite', label: <Link to="/favorite">我的收藏</Link> },
//         {
//             key: '/more',
//             label: (
//                 <Tooltip title="即将上线">
//                     <span style={{ position: 'relative', color: 'gray', cursor: 'not-allowed' }}>
//                         更多
//                         <span style={{
//                             position: 'absolute',
//                             bottom: -8, // 向上偏移
//                             right: -30, // 向右偏移
//                             fontSize: '12px', // 更小的字体
//                             color: '#999' // 稍浅的颜色
//                         }}>
//                             soon
//                         </span>
//                     </span>
//                 </Tooltip>
//             ),
//             disabled: true,
//         }
//     ];

//     // const dropdownMenu = {      //dropdownMenu 是一个对象，符合 Ant Design 的 Dropdown 组件的 menu 属性格式
//     //     // items 数组定义了下拉菜单中的每一项内容
//     //     // key: 'upload'：
//     //     //         每个菜单项必须有唯一的 key，类似 React 列表中的 key
//     //     // 用于内部识别和事件处理
//     //     // label 属性：
//     //     //         定义菜单项的显示内容（可以是文本、组件等）
//     //     //         这里使用了 Ant Design 的<Upload> 组件作为内容
//     //     items: [
//     //         {
//     //             key: 'my-tours',
//     //             label: "我的发布",
//     //         },
//     //         {
//     //             key: 'upload',
//     //             label: (
//     //                 <Upload beforeUpload={handleUpload} showUploadList={false}>
//     //                     {/* 核心属性：
//     //                     beforeUpload={handleUpload}：
//     //                     beforeUpload 是 Upload 组件的钩子函数
//     //                     当用户选择文件后，上传前会触发这个函数
//     //                     handleUpload 是一个自定义函数，用于处理上传逻辑（如校验文件类型、大小，或自定义上传请求）
//     //                     showUploadList={false}：
//     //                     默认情况下，Upload 组件会显示上传列表（已上传的文件）
//     //                     设置为 false 后，不会显示这个列表
//     //                 适合 “上传头像” 这种单次上传场景，不需要显示历史记录 */}
//     //                     {/* <span>更改头像</span> */}
//     //                     {/* <span style={{ display: 'inline-block', width: '100%' }}>更改头像</span> */}
//     //                     <Button type="text" size="small" style={{ padding: 0 }}>更改头像</Button>
//     //                 </Upload >
//     //             ),
//     //         },
//     //         { type: 'divider' },
//     //         {
//     //             key: 'logout',
//     //             label: "退出登录",
//     //         },
//     //     ],
//     //     onClick: ({ key }) => {   //dropdown的用法
//     //         if (key === 'my-tours') {
//     //             navigate('/my-tours');
//     //         } else if (key === 'logout') {
//     //             handleLogout();
//     //         }
//     //     },
//     // }

//     // const dropdownMenu = (
//     //     <Menu>
//     //         <Menu.Item key="my-tours" onClick={() => navigate('/my-tours')}>
//     //             我的发布
//     //         </Menu.Item>

//     //         <Menu.Item key="upload">
//     //             <Upload beforeUpload={handleUpload} showUploadList={false}>
//     //                 {/* 让整个菜单项都可点击上传 */}
//     //                 <div style={{ width: '100%' }}>更改头像</div>
//     //             </Upload>
//     //         </Menu.Item>

//     //         <Menu.Divider />

//     //         <Menu.Item key="logout" onClick={handleLogout}>
//     //             退出登录
//     //         </Menu.Item>
//     //     </Menu>
//     // );

//     const dropdownMenu = (
//         <>
//             <input
//                 type="file"
//                 accept="image/*"
//                 ref={uploadRef}
//                 style={{ display: 'none' }}
//                 onChange={(e) => {
//                     const file = e.target.files[0];
//                     if (file) {
//                         handleUpload(file);
//                         // 重置 input 以便再次选择同一个文件也能触发
//                         e.target.value = null;
//                     }
//                 }}
//             />

//             <Menu>
//                 <Menu.Item key="my-tours" onClick={() => navigate('/my-tours')}>
//                     我的发布
//                 </Menu.Item>

//                 <Menu.Item
//                     key="upload"
//                     onClick={() => {
//                         uploadRef.current?.upload?.fileInput?.click();
//                     }}
//                 >
//                     更改头像
//                 </Menu.Item>

//                 <Menu.Divider />
//                 <Menu.Item key="logout" onClick={handleLogout}>
//                     退出登录
//                 </Menu.Item>
//             </Menu>
//         </>
//     );



//     // 登录状态菜单项
//     const authMenu =
//         user ? (
//             <Dropdown overlay={dropdownMenu} placement="bottomRight">
//                 <span style={{ color: '#fff', cursor: 'pointer', marginLeft: 20, display: 'flex', alignItems: 'center' }}>
//                     Welcome!&nbsp;
//                     <Avatar
//                         size="small"
//                         src={avatarUrl ? `${avatarUrl}?v=${avatarVersion}` : null}
//                         icon={!avatarUrl && <UserOutlined />}
//                         style={{ marginRight: 8 }}
//                     />
//                     {user.username}
//                 </span>
//             </Dropdown>
//         ) : (
//             <span style={{ marginLeft: 20 }}>

//                 <Button type='primary' onClick={() => navigate('/register')}>登录 / 注册</Button>
//             </span>
//         );

//     return (
//         <div style={{ background: '#001529', padding: '0 50px', display: 'flex', alignItems: 'center', height: 64 }} >
//             <Menu
//                 theme="dark"
//                 mode="horizontal"
//                 selectedKeys={[location.pathname]}
//                 items={menuItems}
//                 style={{ flex: 1 }}
//             />
//             {authMenu}
//         </div >
//     );
// };

// export default Header;



// // // 以下是横版header
// import { Menu, Dropdown, message, Tooltip, Button, Upload, Avatar } from 'antd';
// import { UserOutlined } from '@ant-design/icons';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useEffect, useRef, useState } from 'react';
// import axios from 'axios';
// import logo from '../assets/logo1.png';

// const api = import.meta.env.VITE_API_BASE;

// const Header = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const [user, setUser] = useState(null);
//     const [avatarUrl, setAvatarUrl] = useState(null);
//     const [avatarVersion, setAvatarVersion] = useState(Date.now());
//     const uploadRef = useRef();

//     useEffect(() => {
//         const stored = localStorage.getItem('user');
//         if (stored) {
//             const parsed = JSON.parse(stored);
//             setUser(parsed);
//             setAvatarUrl(parsed.avatar);
//         }
//     }, [location.pathname]);

//     const handleLogout = () => {
//         localStorage.removeItem('user');
//         setUser(null);
//         setAvatarUrl(null);
//         message.success('您已退出登录');
//         navigate('/login');
//     };

//     const handleUpload = async (file) => {
//         const formData = new FormData();
//         formData.append('file', file);
//         formData.append('username', user.username);

//         try {
//             const res = await axios.post(`${api}/upload-avatar`, formData);
//             if (res.data.success) {
//                 const updatedUser = { ...user, avatar: res.data.url };
//                 setAvatarUrl(res.data.url);
//                 setUser(updatedUser);
//                 localStorage.setItem('user', JSON.stringify(updatedUser));
//                 setAvatarVersion(Date.now()); // cache busting
//                 message.success('头像上传成功');
//             }
//         } catch (err) {
//             message.error('上传失败');
//         }

//         return false;
//     };

//     const handleMenuClick = ({ key }) => {
//         if (key === 'my-tours') {
//             navigate('/my-tours');
//         } else if (key === 'logout') {
//             handleLogout();
//         } else if (key === 'upload') {
//             uploadRef.current?.click();
//         }
//     };

//     const dropdownMenu = (
//         <>
//             <input
//                 type="file"
//                 accept="image/*"
//                 ref={uploadRef}
//                 style={{ display: 'none' }}
//                 onChange={(e) => {
//                     const file = e.target.files[0];
//                     if (file) {
//                         handleUpload(file);
//                         e.target.value = null; // reset
//                     }
//                 }}
//             />
//             <Menu onClick={handleMenuClick}>
//                 <Menu.Item key="my-tours">我的发布</Menu.Item>
//                 <Menu.Item key="upload">更改头像</Menu.Item>
//                 <Menu.Divider />
//                 <Menu.Item key="logout">退出登录</Menu.Item>
//             </Menu>
//         </>
//     );

//     const authMenu = user ? (
//         <Dropdown overlay={dropdownMenu} trigger={['click']}>
//             <span style={{ color: '#fff', cursor: 'pointer', marginLeft: 20, display: 'flex', alignItems: 'center' }}>
//                 Welcome!&nbsp;
//                 <Avatar
//                     size="small"
//                     src={avatarUrl ? `${avatarUrl}?v=${avatarVersion}` : null}
//                     icon={!avatarUrl && <UserOutlined />}
//                     style={{ marginRight: 8 }}
//                 />
//                 {user.username}
//             </span>
//         </Dropdown>
//     ) : (
//         <span style={{ marginLeft: 20 }}>
//             <Button type="primary" onClick={() => navigate('/register')}>登录 / 注册</Button>
//         </span>
//     );



//     return (
//         <div style={{ background: '#001529', padding: '0 50px', display: 'flex', alignItems: 'center', height: 64 }}>
//             <Link to="/" style={{ marginRight: 30, display: 'flex', alignItems: 'center', color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
//                 <img src={logo} alt="Logo" style={{ height: 40, marginRight: 0 }} />
//             </Link>
//             <div style={{ color: '#fff', marginRight: 30, fontSize: 20 }}> Travel-easy   </div>

//             <Menu
//                 theme="dark"
//                 mode="horizontal"
//                 selectedKeys={[location.pathname]}
//                 items={[
//                     { key: '/', label: <Link to="/">首页</Link> },
//                     { key: '/tours', label: <Link to="/tours">旅游线路</Link> },
//                     { key: '/add-tour', label: <Link to="/add-tour">添加游记</Link> },
//                     { key: '/favorite', label: <Link to="/favorite">我的收藏</Link> },
//                     {
//                         key: '/more',
//                         label: (
//                             <Tooltip title="即将上线">
//                                 <span style={{ position: 'relative', color: 'gray', cursor: 'not-allowed' }}>
//                                     更多
//                                     <span style={{
//                                         position: 'absolute',
//                                         bottom: -8,
//                                         right: -30,
//                                         fontSize: '12px',
//                                         color: '#999'
//                                     }}>
//                                         soon
//                                     </span>
//                                 </span>
//                             </Tooltip>
//                         ),
//                         disabled: true,
//                     }
//                 ]}
//                 style={{ flex: 1 }}
//             />
//             {authMenu}
//         </div>
//     );
// };

// export default Header;

import {
    Menu,
    Dropdown,
    message,
    Avatar,
    Button,
    Tooltip,
    Layout,
} from 'antd';
import {
    HomeOutlined,
    CompassOutlined,
    PlusCircleOutlined,
    HeartOutlined,
    MoreOutlined,
    UserOutlined,
    UploadOutlined,
    LogoutOutlined,
    FileTextOutlined,
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import logo1 from '../assets/logo1.png';

const { Sider } = Layout;

const api = import.meta.env.VITE_API_BASE;

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [avatarVersion, setAvatarVersion] = useState(Date.now());
    const uploadRef = useRef();

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            const parsed = JSON.parse(stored);
            setUser(parsed);
            setAvatarUrl(parsed.avatar);
        }
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setAvatarUrl(null);
        message.success('您已退出登录');
        navigate('/login');
    };

    const handleUpload = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('username', user.username);

        try {
            const res = await axios.post(`${api}/upload-avatar`, formData);
            if (res.data.success) {
                const updatedUser = { ...user, avatar: res.data.url };
                setAvatarUrl(res.data.url);
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setAvatarVersion(Date.now()); // cache busting
                message.success('头像上传成功');
            }
        } catch (err) {
            message.error('上传失败');
        }

        return false;
    };

    const handleMenuClick = ({ key }) => {
        if (key === 'my-tours') {
            navigate('/my-tours');
        } else if (key === 'logout') {
            handleLogout();
        } else if (key === 'upload') {
            uploadRef.current?.click();
        }
    };

    const dropdownMenu = (
        <>
            <input
                type="file"
                accept="image/*"
                ref={uploadRef}
                style={{ display: 'none' }}
                onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                        handleUpload(file);
                        e.target.value = null; // reset
                    }
                }}
            />
            <Menu onClick={handleMenuClick}>
                <Menu.Item key="my-tours" icon={<FileTextOutlined />}>
                    我的发布
                </Menu.Item>
                <Menu.Item key="upload" icon={<UploadOutlined />}>
                    更改头像
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="logout" icon={<LogoutOutlined />}>
                    退出登录
                </Menu.Item>
            </Menu>
        </>
    );

    // const authMenu = user ? (
    //     <Dropdown overlay={dropdownMenu} trigger={['click']}>
    //         <Button
    //             type="text"
    //             style={{
    //                 display: 'flex',
    //                 alignItems: 'center',
    //                 gap: 8,
    //                 padding: '6px 12px',
    //                 border: '1px solid #e0e0e0',
    //                 borderRadius: 8,
    //                 background: '#fafafa',
    //                 boxShadow: 'inset 0 1px 0 rgba(0,0,0,0.03)',
    //                 transition: 'box-shadow 0.2s ease',
    //             }}
    //             onMouseEnter={(e) => {
    //                 e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)';
    //                 e.currentTarget.style.background = '#fff';
    //             }}
    //             onMouseLeave={(e) => {
    //                 e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(0,0,0,0.03)';
    //                 e.currentTarget.style.background = '#fafafa';
    //             }}
    //         >
    //             <Avatar
    //                 size="small"
    //                 src={avatarUrl ? `${avatarUrl}?v=${avatarVersion}` : null}
    //                 icon={!avatarUrl && <UserOutlined />}
    //             />
    //             <span style={{ fontWeight: 500 }}>{user.username}</span>
    //         </Button>
    //     </Dropdown>
    // ) : (
    //     <div style={{ marginTop: 'auto', marginBottom: 20 }}>
    //         <Button type="primary" block onClick={() => navigate('/register')}>
    //             登录 / 注册
    //         </Button>
    //     </div>
    // );

    const authMenu = user ? (
        <Dropdown overlay={dropdownMenu} trigger={['click']}>
            <div
                style={{
                    width: '100%',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f5f5f5';
                    e.currentTarget.style.boxShadow = 'inset 0 0 0 1px #e0e0e0';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                }}
            >
                <Avatar
                    size="small"
                    src={avatarUrl ? `${avatarUrl}?v=${avatarVersion}` : null}
                    icon={!avatarUrl && <UserOutlined />}
                    style={{ marginRight: 8 }}
                />
                <span style={{ fontWeight: 500 }}>{user.username}</span>
            </div>
        </Dropdown>
    ) : (
        <div style={{ padding: '0 16px', marginBottom: 20 }}>
            <Button type="primary" block onClick={() => navigate('/register')}>
                登录 / 注册
            </Button>
        </div>
    );

    return (
        <Sider
            width={200}
            style={{
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                background: '#fff',
                borderRight: '1px solid #f0f0f0',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 1000,
                paddingTop: 20,
            }}
        >
            {/* 顶部 Logo 区域 */}
            <Link to="/" style={{ textDecoration: 'none' }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 30,
                        cursor: 'pointer',
                        color: 'inherit',
                    }}
                >
                    <img src={logo1} alt="Logo" style={{ height: 30, marginRight: 8 }} />
                    <div style={{ fontWeight: 'bold', fontSize: 18, color: 'black' }}>Travel-easy</div>
                </div>
            </Link>

            {/* 中间内容：使用 flex: 1 撑开中间空间 */}
            <div style={{ flex: 1, overflow: 'auto' }}>
                <Menu
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    style={{ borderRight: 0, height: '100%' }}
                    items={[
                        {
                            key: '/',
                            icon: <HomeOutlined />,
                            label: <Link to="/">首页</Link>,
                        },
                        {
                            key: '/tours',
                            icon: <CompassOutlined />,
                            label: <Link to="/tours">旅游线路</Link>,
                        },
                        {
                            key: '/add-tour',
                            icon: <PlusCircleOutlined />,
                            label: <Link to="/add-tour">添加游记</Link>,
                        },
                        {
                            key: '/favorite',
                            icon: <HeartOutlined />,
                            label: <Link to="/favorite">我的收藏</Link>,
                        },
                        {
                            key: '/more',
                            icon: <MoreOutlined />,
                            label: (
                                <Tooltip title="即将上线">
                                    <span style={{ color: '#999', cursor: 'not-allowed' }}>
                                        更多 <small style={{ fontSize: 10 }}>soon</small>
                                    </span>
                                </Tooltip>
                            ),
                            disabled: true,
                        },
                    ]}
                />
            </div>

            {/* ✅ 完全贴底的登录头像按钮 */}
            <div
                style={{
                    padding: '16px',
                    borderTop: '1px solid #f0f0f0',
                    marginTop: 'auto', // 关键修改：确保这个div被推到最底部
                }}
            >
                {authMenu}
            </div>
        </Sider>




    );
};

export default Header;

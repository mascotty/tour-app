import { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Button, message } from 'antd';
import { Link } from 'react-router-dom';
import { destinations } from '../data/mockData';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { checkLoginAndRun } from '../utils/checkLoginAndRun';
import axios from 'axios';

const api = import.meta.env.VITE_API_BASE;


const { Option } = Select;

const TourList = () => {
    const navigate = useNavigate();

    const [category, setCategory] = useState('all');
    const [favorites, setFavorites] = useState([]);

    // 初始加载收藏状态
    // 从浏览器的本地存储中获取之前保存的收藏数据，如果存在则解析并更新favorites状态。
    // useEffect(() => {
    //     const stored = localStorage.getItem('favorites');
    //     if (stored) {
    //         setFavorites(JSON.parse(stored));
    //     }
    // }, []);

    useEffect(() => {
        const fetchFavorites = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.username) return;

            try {
                const res = await axios.get(`${api}/api/favorites?username=${user.username}`);
                const ids = res.data;
                setFavorites(ids);
                localStorage.setItem('favorites', JSON.stringify(ids));
                console.error("加载收藏成功");

            } catch (err) {
                console.error("加载收藏失败", err);
            }
        };

        fetchFavorites();
    }, []);


    // // 点击收藏/取消收藏    逻辑重点！！！！
    // const toggleFavorite = (id) => {
    //     checkLoginAndRun(() => {
    //         let updated;
    //         if (favorites.includes(id)) {               //检查当前点击的目的地 ID 是否存在于收藏列表中
    //             updated = favorites.filter(fid => fid !== id);              //filter(fid => fid !== id)：创建一个新数组，排除掉与当前 ID 匹配的项（即取消收藏）
    //             message.info('已取消收藏');
    //         } else {
    //             updated = [...favorites, id];              //使用展开语法创建一个新数组，在原有收藏列表末尾添加新 ID（即添加收藏）
    //             message.success('已添加到收藏');
    //         }
    //         setFavorites(updated);   //调用 setFavorites 更新 favorites 状态，这会触发组件重新渲染，更新心形图标的显示
    //         localStorage.setItem('favorites', JSON.stringify(updated));     //保存到本地存储中      以 JSON 字符串形式存储到浏览器的 localStorage 中，这样即使用户刷新页面或关闭浏览器后再回来，收藏状态也能保持
    //     }, navigate);
    // };



    const toggleFavorite = (id) => {
        checkLoginAndRun(async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.username) {
                message.error("用户信息缺失");
                return;
            }

            const isFavorited = favorites.includes(id);
            const updated = isFavorited
                ? favorites.filter(fid => fid !== id)
                : [...favorites, id];

            // 本地状态更新
            setFavorites(updated);
            localStorage.setItem('favorites', JSON.stringify(updated));
            message.success(isFavorited ? '已取消收藏' : '已添加到收藏');

            // 同步到后端
            try {
                await axios.post('${api}/api/favorites', {
                    username: user.username,

                    tour_id: id,
                    action: isFavorited ? 'remove' : 'add'
                });
            } catch (err) {
                console.error("同步失败", err);
                message.error("同步服务器失败");
            }
        }, navigate);
    };




    const filteredTours =
        category === 'all'
            ? destinations
            : destinations.filter(tour => tour.category === category);

    return (
        <div className="container" style={{ padding: '20px 0' }}>
            <div style={{ marginBottom: 20 }}>
                <Select
                    defaultValue="all"
                    style={{ width: 200 }}
                    onChange={value => setCategory(value)}      //首先会在select选择框内将选中元素值设置为category
                >
                    <Option value="all">全部</Option>
                    <Option value="浪漫">浪漫</Option>
                    <Option value="文化">文化</Option>
                    <Option value="度假">度假</Option>
                </Select>
            </div>

            <Row gutter={[16, 16]}>
                {filteredTours.map(tour => (            //因为初始时category是all，所以destination也是全部，所以filteredTours也显示全部
                    <Col xs={24} sm={12} md={8} lg={6} key={tour.id}>
                        {/* 这是响应式布局的核心，表示在不同屏幕尺寸下 Col 占据的单元数：
                        xs：超小屏幕（如手机，<576px）时占据 24 个单元（即满屏宽度）。
                        sm：小屏幕（如平板，≥576px）时占据 12 个单元（半屏宽度）。
                        md：中等屏幕（如笔记本，≥768px）时占据 8 个单元（1/3 屏宽度）。
                        lg：大屏幕（如桌面显示器，≥992px）时占据 6 个单元（1/4 屏宽度）。
                        key={tour.id}：React 列表渲染时必须为每个 Col 提供唯一的 key，用于优化渲染性能。 */}
                        <Card
                            //     Card 组件：Ant Design 的核心展示组件，用于包裹内容形成独立信息块，默认带有边框和阴影。
                            // 嵌套关系：
                            //     Card 包含 Card.Meta（元信息），cover 和 actions 是 Card 的属性（非子组件）。
                            cover={
                                <img
                                    alt={tour.name}
                                    src={tour.image}
                                    style={{ height: 200, objectFit: 'cover' }}     //cover:图片等比例缩放并覆盖容器，避免变形（例如横向图片会裁剪左右两侧，纵向图片会裁剪上下两侧）。
                                />
                            }
                            actions={[          //actions 中的按钮默认显示在卡片底部，可通过 cardStyle={{ display: 'flex', flexDirection: 'column' }} 调整为顶部显示。
                                <Link to={`/tours/${tour.id}`}>查看详情</Link>,
                                favorites.includes(tour.id) ? (     //这里根据id是否在favorites里面而选择显示收藏还是未收藏
                                    <HeartFilled
                                        key="filled"
                                        style={{ color: 'purple' }}
                                        onClick={() => toggleFavorite(tour.id)}
                                    />
                                ) : (
                                    <HeartOutlined
                                        key="outlined"
                                        onClick={() => toggleFavorite(tour.id)}
                                    />
                                ),
                            ]}
                        >
                            <Card.Meta
                                title={tour.name}
                                description={`￥${tour.price} | ${tour.duration}`}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default TourList;

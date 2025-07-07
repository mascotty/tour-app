import { useParams } from 'react-router-dom';
import { Card, Button, Descriptions } from 'antd';
import { destinations } from '../data/mockData';

const TourDetail = () => {
    const { id } = useParams(); // 获取 URL 参数
    const tour = destinations.find(t => t.id === Number(id)); // 查找对应线路

    if (!tour) {
        return <div style={{ padding: 20 }}>线路不存在</div>;
    }

    return (
        <div className="container" style={{ padding: '20px' }}>
            <Card
                cover={
                    <img
                        alt={tour.name}
                        src={tour.image}
                        style={{ height: 400, objectFit: 'cover' }}
                    />
                }
            >
                <Descriptions
                    title={tour.name}
                    bordered
                    size="middle"
                    column={1}
                    style={{ marginBottom: 20 }}
                >
                    <Descriptions.Item label="价格">￥{tour.price}</Descriptions.Item>
                    <Descriptions.Item label="时长">{tour.duration}</Descriptions.Item>
                    <Descriptions.Item label="类别">{tour.category}</Descriptions.Item>
                    <Descriptions.Item label="描述">{tour.description}</Descriptions.Item>
                </Descriptions>

                <Button type="primary">立即预订</Button>
            </Card>
        </div>
    );
};

export default TourDetail;

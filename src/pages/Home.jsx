import { Input, Button, Card, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import Banner from '../components/Banner';
import { chartData, destinations } from '../data/mockData';
import { useState } from 'react';

const Home = () => {
    const [keyword, setKeyword] = useState('');
    const [filtered, setFiltered] = useState(destinations);

    const chartOptions = {
        title: { text: '热门目的地统计' },
        tooltip: {},
        xAxis: { type: 'category', data: chartData.map(item => item.name) },
        yAxis: { type: 'value' },
        series: [{ type: 'bar', data: chartData.map(item => item.value) }],
    };

    const handleSearch = () => {
        const trimmed = keyword.trim().toLowerCase();
        if (trimmed === '') {
            setFiltered(destinations);
        } else {
            const result = destinations.filter(d =>
                d.name.toLowerCase().includes(trimmed) ||
                d.description.toLowerCase().includes(trimmed) ||
                d.category.toLowerCase().includes(trimmed)
            );
            setFiltered(result);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Banner />
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <Input
                    placeholder="搜索目的地"
                    prefix={<SearchOutlined />}
                    style={{ width: 300, marginRight: 10 }}
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    onPressEnter={handleSearch}
                />
                <Button type="primary" onClick={handleSearch}>搜索</Button>
            </div>

            <Row justify="center" gutter={[16, 16]}>
                <Col span={16}>
                    <Card title="热门目的地统计">
                        <ReactECharts option={chartOptions} style={{ height: 400 }} />
                    </Card>
                </Col>
            </Row>

            <div style={{ marginTop: '40px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>搜索结果</h2>
                <Row gutter={[16, 16]}>
                    {filtered.length === 0 ? (
                        <p style={{ textAlign: 'center', width: '100%' }}>未找到匹配目的地</p>
                    ) : (
                        filtered.map(tour => (
                            <Col xs={24} sm={12} md={8} key={tour.id}>
                                <Card
                                    cover={
                                        <img
                                            alt={tour.name}
                                            src={tour.image}
                                            style={{ height: 200, objectFit: 'cover' }}
                                        />
                                    }
                                    actions={[<Button type="link" href={`/tours/${tour.id}`}>查看详情</Button>]}
                                >
                                    <Card.Meta
                                        title={tour.name}
                                        description={`￥${tour.price} | ${tour.duration}`}
                                    />
                                </Card>
                            </Col>
                        ))
                    )}
                </Row>
            </div>
        </div>
    );
};

export default Home;

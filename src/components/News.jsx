import React, { useEffect, useState } from "react";
import { Select, Typography, Row, Col, Avatar, Card } from "antd";
import moment from "moment";

import { useGetCryptoNewsQuery } from "../services/cryptoNewsApi";
import { useGetCryptosQuery } from "../services/cryptoApi";

const { Title, Text } = Typography;
const { Option } = Select;

const demoImg =
  "http://coinrevolution.com/wp-content/uploads/2020/06/cryptonews.jpg";

const News = ({ simplified }) => {
  const count = simplified ? 6 : 100;

  const [newsCategory, setNewsCategory] = useState("Cryptocurrencies");
  const [cryptoNewsList, setCryptoNewsList] = useState([]);

  const { data: cryptoNews, isFetching } = useGetCryptoNewsQuery({
    newsCategory,
    count,
  });

  const { data } = useGetCryptosQuery(100);

  useEffect(() => {
    const data = cryptoNews?.value;
    setCryptoNewsList(data);
  }, [cryptoNewsList, cryptoNews]);

  if (isFetching) return "Loading...";
  return (
    <>
      <Row gutter={[24, 24]}>
        {!simplified && (
          <Col span={24}>
            <Select
              showSearch
              className="select-news"
              placeholder="Select a coin"
              optionFilterProp="children"
              onChange={value => setNewsCategory(value)}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value="Cryptocurrency">Cryptocurrency</Option>
              {data?.data?.coins.map(coin => (
                <Option value={coin.name}>{coin.name}</Option>
              ))}
            </Select>
          </Col>
        )}
        {cryptoNewsList?.map((news, i) => (
          <Col xs={24} sm={12} lg={8} key={i}>
            <Card hoverable className="news-card">
              <a href={news.url} target="_blank" rel="noreferrer">
                <div className="news-image-container">
                  <Title className="news-title" level={4}>
                    {news.name}
                  </Title>
                  <img
                    src={news.image?.thumbnail?.contentUrl || demoImg}
                    alt="news"
                  />
                </div>

                <p>
                  {news.description > 100
                    ? `${news.description.substring(0, 100)}...`
                    : `${news.description}`}
                </p>
                <div className="provider-container">
                  <div>
                    <Avatar
                      src={
                        news.provider[0].image?.thumbnail?.contentUrl || demoImg
                      }
                    />
                    <Text className="provider-name">
                      {news.provider[0].name}
                    </Text>
                  </div>
                  <Text className="provider-name">
                    {moment(news.datePublished).startOf("ss").fromNow()}
                  </Text>
                </div>
              </a>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default News;

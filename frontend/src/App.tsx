import { useState, useEffect } from 'react';
import {
  Layout,
  Input,
  Select,
  Card,
  Tag,
  Row,
  Col,
  Typography,
  Space,
  Spin,
  Empty,
  ConfigProvider,
  Button,
  Segmented,
  message,
} from 'antd';
import {
  SearchOutlined,
  CalendarOutlined,
  LinkOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { bookAPI } from './api';
import type { Book } from './api';
import './App.css';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

// Type for view modes
type ViewMode = 'grid' | 'list';
type DateFilter = 'all' | 'week' | 'month' | 'quarter';

// Integration color mapping
const integrationColors: Record<string, string> = {
  'NYT Books Section': '#000000',
  "NPR's Book of the Day": '#D62E2E',
  'Service95 Book Club With Dua Lipa': '#FF006E',
  'The Book Review': '#2E7D32',
};

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const integrationColor = integrationColors[book.integration_name] || '#4F46E5';
  
  return (
    <Card
      hoverable
      className="book-card"
      styles={{
        body: { padding: '16px' }
      }}
    >
      <Space direction="vertical" size={8} style={{ width: '100%' }}>
        <Row justify="space-between" align="top">
          <Tag 
            color={integrationColor}
            style={{ 
              backgroundColor: `${integrationColor}10`,
              color: integrationColor,
              border: 'none',
              borderRadius: '12px',
              padding: '4px 12px'
            }}
          >
            {book.integration_name}
          </Tag>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            <CalendarOutlined /> {dayjs(book.date).format('MMM DD, YYYY')}
          </Text>
        </Row>
        
        <div>
          <Title level={5} style={{ margin: '8px 0 4px 0' }}>
            {book.book}
          </Title>
          <Text type="secondary">by {book.author}</Text>
        </div>
        
        <Button
          type="link"
          href={book.url}
          target="_blank"
          icon={<LinkOutlined />}
          style={{ padding: 0, marginTop: '8px' }}
        >
          View on {book.integration_name}
        </Button>
      </Space>
    </Card>
  );
};

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedIntegration, setSelectedIntegration] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Fetch data from your backend
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await bookAPI.getAllBooks();
      setBooks(data);
      setFilteredBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
      message.error('Failed to load books. Please try again later.');
      setBooks([]);
      setFilteredBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter books based on search and filters
  useEffect(() => {
    let filtered = [...books];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(book => 
        book.book.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Integration filter
    if (selectedIntegration !== 'all') {
      filtered = filtered.filter(book => 
        book.integration_name === selectedIntegration
      );
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = dayjs();
      filtered = filtered.filter(book => {
        const bookDate = dayjs(book.date);
        switch (dateFilter) {
          case 'week':
            return bookDate.isAfter(now.subtract(1, 'week'));
          case 'month':
            return bookDate.isAfter(now.subtract(1, 'month'));
          case 'quarter':
            return bookDate.isAfter(now.subtract(3, 'month'));
          default:
            return true;
        }
      });
    }

    setFilteredBooks(filtered);
  }, [searchTerm, selectedIntegration, dateFilter, books]);

  const integrations = ['all', ...new Set(books.map(book => book.integration_name))];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#4F46E5',
          borderRadius: 8,
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
        <Header style={{ 
          background: '#FFFFFF', 
          height: 'auto', 
          padding: '24px 32px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <Row justify="space-between" align="middle">
            <div>
              <Title level={2} style={{ margin: 0 }}>
                📚 Book Club Hub
              </Title>
              <Text type="secondary">
                Discover latest book recommendations
              </Text>
            </div>
            <Segmented
              options={[
                { label: <AppstoreOutlined />, value: 'grid' },
                { label: <UnorderedListOutlined />, value: 'list' },
              ]}
              value={viewMode}
              onChange={(value) => setViewMode(value as ViewMode)}
            />
          </Row>
        </Header>

        <Content style={{ padding: '24px 32px' }}>
          {/* Search and Filters */}
          <Row gutter={12} style={{ marginBottom: 24 }}>
            <Col flex="auto">
              <Search
                placeholder="Search books, authors..."
                allowClear
                size="large"
                prefix={<SearchOutlined />}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%' }}
              />
            </Col>
            <Col>
              <Select
                size="large"
                style={{ width: 160 }}
                value={selectedIntegration}
                onChange={(value: string) => setSelectedIntegration(value)}
                placeholder="All Sources"
              >
                {integrations.map(integration => (
                  <Select.Option key={integration} value={integration}>
                    {integration === 'all' ? 'All Sources' : integration}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Select
                size="large"
                style={{ width: 140 }}
                value={dateFilter}
                onChange={(value: DateFilter) => setDateFilter(value)}
                placeholder="All Time"
              >
                <Select.Option value="all">All Time</Select.Option>
                <Select.Option value="week">Past Week</Select.Option>
                <Select.Option value="month">Past Month</Select.Option>
                <Select.Option value="quarter">Past Quarter</Select.Option>
              </Select>
            </Col>
          </Row>

          {/* Books Grid/List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px' }}>
              <Spin size="large" />
            </div>
          ) : filteredBooks.length === 0 ? (
            <Empty
              description={
                <span>
                  No books found
                  <br />
                  Try adjusting your filters
                </span>
              }
              style={{ padding: '48px' }}
            />
          ) : (
            <Row gutter={[24, 24]}>
              {filteredBooks.map((book, index) => (
                <Col
                  key={`${book.url}-${index}`}
                  xs={24}
                  sm={viewMode === 'list' ? 24 : 12}
                  lg={viewMode === 'list' ? 24 : 8}
                >
                  <BookCard book={book} />
                </Col>
              ))}
            </Row>
          )}
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
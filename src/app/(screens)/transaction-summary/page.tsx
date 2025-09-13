"use client";

import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Input, Select, Pagination, Space, Typography, Tag, Spin, Alert } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { germanStandardApi } from '@/services/germanStandardApi';
import { store } from '@/redux/store/store';
import { reduxAccessToken } from '@/redux/slice/authSlice';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

interface TransactionSummaryPageProps {}

const TransactionSummaryPage: React.FC<TransactionSummaryPageProps> = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    docType: 1,
    be: 1,
    search: '',
  });

  const fetchTransactions = async (page: number = 1, pageSize: number = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      // Check authentication status
      const state = store.getState();
      const accessToken = reduxAccessToken(state);
      
      console.log('🔍 Fetching transactions with params:', {
        docType: filters.docType,
        be: filters.be,
        page,
        pageSize,
        search: filters.search,
        hasToken: !!accessToken
      });

      if (!accessToken) {
        throw new Error('No authentication token found. Please login first.');
      }

      const result = await germanStandardApi.getTransactionSummary(
        filters.docType,
        filters.be,
        true, // refreshFlag
        page,
        pageSize,
        filters.search || undefined
      );
      console.log('🔍 Result:', result);

      console.log('📊 API Response:', result);

      if (result.transactions && result.transactions.length > 0) {
        const transformedData = germanStandardApi.transformTransactionsForDisplay(result.transactions);
        console.log('✅ Transformed data:', transformedData);
        setTransactions(transformedData);
        setPagination(prev => ({
          ...prev,
          current: page,
          total: result.totalRows,
        }));
      } else {
        console.log('⚠️ No transactions found in response');
        setTransactions([]);
        setPagination(prev => ({
          ...prev,
          current: page,
          total: 0,
        }));
      }
    } catch (err: any) {
      console.error('❌ Error fetching transactions:', err);
      setError(err.message || 'Failed to fetch transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
    fetchTransactions(1, pagination.pageSize);
  };

  const handleDocTypeChange = (value: number) => {
    setFilters(prev => ({ ...prev, docType: value }));
    fetchTransactions(1, pagination.pageSize);
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    fetchTransactions(page, pageSize || pagination.pageSize);
  };

  const handleRefresh = () => {
    fetchTransactions(pagination.current, pagination.pageSize);
  };

  const columns = [
    {
      title: 'Transaction ID',
      dataIndex: 'transId',
      key: 'transId',
      sorter: (a: any, b: any) => a.transId - b.transId,
    },
    {
      title: 'Document No',
      dataIndex: 'docNo',
      key: 'docNo',
      render: (text: string) => (
        <Text code>{text}</Text>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'formattedDate',
      key: 'date',
      sorter: (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'Purchase Order' ? 'blue' : 
                     status === 'Order' ? 'green' : 
                     status === 'Request for Quote' ? 'orange' : 'default';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Title level={2}>Transaction Summary</Title>
          <Text type="secondary">
            View and manage transaction summaries from German Standard API
          </Text>
        </div>

        {/* Filters */}
        <Card size="small" style={{ marginBottom: '16px' }}>
          <Space wrap>
            <div>
              <Text strong>Document Type:</Text>
              <Select
                value={filters.docType}
                onChange={handleDocTypeChange}
                style={{ width: 120, marginLeft: 8 }}
              >
                <Option value={1}>Type 1</Option>
                <Option value={2}>Type 2</Option>
                <Option value={3}>Type 3</Option>
              </Select>
            </div>
            
            <div>
              <Text strong>Search:</Text>
              <Search
                placeholder="Search transactions..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                onSearch={handleSearch}
                style={{ width: 200, marginLeft: 8 }}
                allowClear
              />
            </div>

            <Button 
              icon={<ReloadOutlined />} 
              onClick={handleRefresh}
              loading={loading}
            >
              Refresh
            </Button>
          </Space>
        </Card>

        {/* Results */}
        {error && (
          <Alert
            message="Error"
            description={     
              error.includes('No authentication token') ? (
                <div>
                  <p>{error}</p>
                  <Button  style={{ marginTop: '8px' }}>
                    Go to Login
                  </Button>
                </div>
              ) : (
                error
              )
            }
            type="error"
            showIcon
            style={{ marginBottom: '16px' }}
          />
        )}

        <Card>
          <div style={{ marginBottom: '16px' }}>
            <Text strong>
              {pagination.total} transactions found
              {filters.search && ` (filtered by "${filters.search}")`}
            </Text>
          </div>

          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={transactions}
              rowKey="transId"
              pagination={false}
              scroll={{ x: 800 }}
            />
          </Spin>

          {pagination.total > 0 && (
            <div style={{ marginTop: '16px', textAlign: 'right' }}>
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={handlePageChange}
                showSizeChanger
                showQuickJumper
                showTotal={(total, range) => 
                  `${range[0]}-${range[1]} of ${total} items`
                }
              />
            </div>
          )}
        </Card>

        {/* Debug Info */}
        <Card size="small" style={{ marginTop: '16px' }}>
          <Title level={5}>Debug Information</Title>
          <Text type="secondary">
            <strong>API Endpoint:</strong> German Standard Transaction Summary API<br/>
            <strong>Document Type:</strong> {filters.docType} | 
            <strong> BE:</strong> {filters.be} | 
            <strong> Page:</strong> {pagination.current} | 
            <strong> Page Size:</strong> {pagination.pageSize}<br/>
            <strong>Raw Transactions Count:</strong> {transactions.length}<br/>
            <strong>Loading:</strong> {loading ? 'Yes' : 'No'} | 
            <strong>Error:</strong> {error || 'None'}
          </Text>
          <div style={{ marginTop: '8px' }}>
            <Text type="secondary">
              <strong>Instructions:</strong> Open browser console (F12) to see detailed API logs and error messages.
            </Text>
          </div>
        </Card>
      </Card>
    </div>
  );
};

export default TransactionSummaryPage;

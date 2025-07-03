// testElasticSearch.ts
// Run this file to test your ElasticSearch connection and debug issues

import elasticsearchService from './services/elasticsearchService';

async function testElasticSearch() {
  console.log('🔍 Testing ElasticSearch Connection...\n');

  // Test 1: Check if ElasticSearch is running
  try {
    const response = await fetch('/api/elasticsearch');
    const info = await response.json();
    console.log('✅ ElasticSearch is accessible via proxy');
    console.log(`   Cluster: ${info.cluster_name || 'Unknown'}`);
    console.log(`   Status: ${info.status || 'Unknown'}\n`);
  } catch (error) {
    console.error('❌ ElasticSearch is not accessible via proxy');
    console.error('   Error:', error);
    console.error('   Make sure your Vite proxy is configured correctly\n');
    return;
  }

  // Test 2: Check if index exists
  console.log('📊 Checking index status...');
  const indexExists = await elasticsearchService.checkIndexExists();
  console.log(`   Index exists: ${indexExists}\n`);

  // Test 3: Initialize index
  console.log('🏗️  Initializing index...');
  try {
    await elasticsearchService.initializeIndex();
    console.log('✅ Index initialized successfully\n');
  } catch (error) {
    console.error('❌ Failed to initialize index:', error);
  }

  // Test 4: Index a test document
  console.log('📄 Indexing test document...');
  try {
    const testDoc = {
      id: 'test-doc-1',
      title: 'وثيقة تجريبية',
      content: 'هذا محتوى تجريبي لاختبار البحث في النظام',
      fileType: 'pdf',
      fileSize: 1024,
      uploadDate: new Date().toISOString(),
      author: 'مستخدم النظام',
      tags: ['test', 'اختبار', 'تجريبي'],
      category: 'اختبار',
      filename: 'test-document.pdf',
      extractedText: 'هذا محتوى تجريبي لاختبار البحث في النظام',
      summary: 'وثيقة اختبار للتأكد من عمل ElasticSearch',
      metadata: {
        description: 'وثيقة اختبار للتأكد من عمل ElasticSearch',
        department: 'تقنية المعلومات',
        risk_level: 'low'
      }
    };

    const result = await elasticsearchService.indexDocument(testDoc);
    console.log('✅ Test document indexed successfully:', result);
    console.log('');
  } catch (error) {
    console.error('❌ Failed to index document:', error);
  }

  // Test 5: Search for the document
  console.log('🔎 Searching for test document...');
  try {
    const searchResult = await elasticsearchService.searchDocuments('تجريبية');
    console.log(`✅ Found ${searchResult.results.length} results`);
    if (searchResult.results.length > 0) {
      console.log('   First result:', searchResult.results[0].title);
      console.log('   Relevance score:', searchResult.results[0].relevanceScore);
      console.log('   Search time:', searchResult.searchTime, 'ms');
    }
    console.log('');
  } catch (error) {
    console.error('❌ Search failed:', error);
  }

  // Test 6: Get document stats
  console.log('📈 Getting document statistics...');
  try {
    const stats = await elasticsearchService.getDocumentStats();
    console.log('✅ Stats retrieved successfully');
    console.log(`   Total documents: ${stats.totalDocuments}`);
    console.log(`   File types: ${Object.keys(stats.fileTypes).join(', ')}`);
    console.log(`   Categories: ${Object.keys(stats.categories).join(', ')}`);
    console.log(`   ElasticSearch enabled: ${stats.elasticsearchEnabled}`);
    console.log('');
  } catch (error) {
    console.error('❌ Failed to get stats:', error);
  }

  // Test 7: Get all documents
  console.log('📚 Fetching all documents...');
  try {
    const allDocs = await elasticsearchService.getAllDocuments();
    console.log(`✅ Retrieved ${allDocs.length} documents\n`);
  } catch (error) {
    console.error('❌ Failed to get all documents:', error);
  }

  // Test 8: Health check
  console.log('🏥 Performing health check...');
  try {
    const isHealthy = await elasticsearchService.checkHealth();
    console.log(`✅ Health check result: ${isHealthy ? 'Healthy' : 'Unhealthy'}\n`);
  } catch (error) {
    console.error('❌ Health check failed:', error);
  }

  console.log('🎉 Test completed!');
}

// Run the test
testElasticSearch().catch(console.error);

// You can also test specific functions individually:
export async function testSpecificFunction() {
  // Test a specific scenario
  try {
    const results = await elasticsearchService.searchDocuments('finance');
    console.log('Search results:', results);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Debug helper to check raw ElasticSearch response
export async function debugElasticSearch() {
  try {
    const response = await fetch('/api/elasticsearch/mof-documents/_search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: { match_all: {} },
        size: 1
      })
    });
    
    const data = await response.json();
    console.log('Raw ElasticSearch response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Debug error:', error);
  }
}

export { testElasticSearch }
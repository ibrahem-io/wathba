// runElasticSearchTest.ts
// Simple script to run the ElasticSearch test

import { testElasticSearch, testSpecificFunction, debugElasticSearch } from './testElasticSearch';

// Choose which test to run
const testToRun = process.argv[2] || 'all';

async function main() {
  console.log('🧪 ElasticSearch Test Runner\n');
  
  switch (testToRun) {
    case 'all':
      await testElasticSearch();
      break;
    case 'specific':
      await testSpecificFunction();
      break;
    case 'debug':
      await debugElasticSearch();
      break;
    default:
      console.log('Unknown test. Available options: all, specific, debug');
  }
}

main().catch(error => {
  console.error('Test runner error:', error);
  process.exit(1);
});
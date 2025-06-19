import supabase from '../lib/supabase';
import { Database } from '../lib/database.types';

type ApiConfiguration = Database['public']['Tables']['api_configurations']['Row'];
type ApiConfigurationInsert = Database['public']['Tables']['api_configurations']['Insert'];
type ApiConfigurationUpdate = Database['public']['Tables']['api_configurations']['Update'];

export async function getApiConfigurations() {
  const { data, error } = await supabase
    .from('api_configurations')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching API configurations:', error);
    throw error;
  }
  
  return data;
}

export async function getActiveApiConfiguration(serviceType: string) {
  const { data, error } = await supabase
    .from('api_configurations')
    .select('*')
    .eq('service_type', serviceType)
    .eq('is_active', true)
    .single();
    
  if (error) {
    console.error('Error fetching active API configuration:', error);
    throw error;
  }
  
  return data;
}

export async function createApiConfiguration(
  config: Partial<ApiConfigurationInsert>,
  userId: string
) {
  const newConfig: ApiConfigurationInsert = {
    service_name: config.service_name!,
    service_type: config.service_type!,
    endpoint_url: config.endpoint_url!,
    api_key: config.api_key,
    auth_type: config.auth_type!,
    headers: config.headers || {},
    parameters: config.parameters || {},
    is_active: config.is_active ?? true,
    created_by: userId,
  };
  
  const { data, error } = await supabase
    .from('api_configurations')
    .insert(newConfig)
    .select()
    .single();
    
  if (error) {
    console.error('Error creating API configuration:', error);
    throw error;
  }
  
  return data;
}

export async function updateApiConfiguration(
  id: string,
  updates: Partial<ApiConfigurationUpdate>
) {
  const { data, error } = await supabase
    .from('api_configurations')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating API configuration:', error);
    throw error;
  }
  
  return data;
}

export async function deleteApiConfiguration(id: string) {
  const { error } = await supabase
    .from('api_configurations')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting API configuration:', error);
    throw error;
  }
  
  return true;
}

export async function testApiConnection(config: ApiConfiguration) {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers as Record<string, string>
    };
    
    // Add authentication header based on auth type
    if (config.api_key) {
      switch (config.auth_type) {
        case 'api_key':
          headers['X-API-Key'] = config.api_key;
          break;
        case 'bearer_token':
          headers['Authorization'] = `Bearer ${config.api_key}`;
          break;
      }
    }
    
    const response = await fetch(config.endpoint_url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        test: true,
        ...config.parameters as Record<string, any>
      })
    });
    
    return {
      success: response.ok,
      status: response.status,
      statusText: response.statusText
    };
  } catch (error) {
    console.error('Error testing API connection:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function logApiUsage(
  configId: string,
  userId: string,
  requestType: string,
  responseStatus: number,
  responseTime: number,
  requestSize?: number,
  responseSize?: number,
  errorMessage?: string
) {
  const { error } = await supabase
    .from('api_usage_logs')
    .insert({
      api_config_id: configId,
      user_id: userId,
      request_type: requestType,
      response_status: responseStatus,
      response_time: responseTime,
      request_size: requestSize,
      response_size: responseSize,
      error_message: errorMessage
    });
    
  if (error) {
    console.error('Error logging API usage:', error);
  }
}
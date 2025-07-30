'use client';

import { useState, useEffect } from 'react';
import { apiClient, ApiResponse, HealthCheckResponse } from '@/lib/api';
import { config } from '@/lib/config';

export default function BackendStatus() {
  const [healthStatus, setHealthStatus] = useState<ApiResponse<HealthCheckResponse> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.getHealth();
      setHealthStatus(response);
      
      if (!response.success) {
        // Handle error that can be either string or object
        const errorMessage = typeof response.error === 'string' 
          ? response.error 
          : response.error?.message || 'Health check failed';
        setError(errorMessage);
      }
    } catch (err) {
      setError('Failed to connect to backend');
      console.error('Health check error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="p-6 bg-gray-900 rounded-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">
        Backend Connection Status
      </h3>
      
      <div className="space-y-4">
        {/* API URL Display */}
        <div className="text-sm text-gray-300">
          <span className="font-medium">API URL:</span> {config.api.baseUrl}
        </div>

        {/* Connection Status */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-300">Status:</span>
          {loading ? (
            <span className="text-yellow-400">Checking...</span>
          ) : healthStatus?.success ? (
            <span className="text-green-400 flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              Connected
            </span>
          ) : (
            <span className="text-red-400 flex items-center">
              <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
              Disconnected
            </span>
          )}
        </div>

        {/* Health Data */}
        {healthStatus?.success && healthStatus.data && (
          <div className="bg-gray-800 p-4 rounded border border-gray-600">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Health Data:</h4>
            <div className="text-xs text-gray-400 space-y-1">
              <div>Status: {healthStatus.data.status}</div>
              <div>Environment: {healthStatus.data.environment}</div>
              <div>Version: {healthStatus.data.version}</div>
              <div>Uptime: {Math.round(healthStatus.data.uptime)}s</div>
              <div>Timestamp: {new Date(healthStatus.data.timestamp).toLocaleString()}</div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/20 border border-red-700 p-3 rounded text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Refresh Button */}
        <button
          onClick={checkHealth}
          disabled={loading}
          className="px-4 py-2 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-600 text-white rounded text-sm font-medium transition-colors"
        >
          {loading ? 'Checking...' : 'Refresh Status'}
        </button>
      </div>
    </div>
  );
} 
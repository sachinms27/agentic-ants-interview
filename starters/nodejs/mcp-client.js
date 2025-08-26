/**
 * MCP Client for Real Estate Search
 * Connects to the MCP server to provide enhanced search capabilities
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';

class MCPSearchClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      // Spawn the MCP server process
      const serverProcess = spawn('node', ['mcp-server.js'], {
        stdio: ['pipe', 'pipe', 'inherit'],
        cwd: process.cwd()
      });

      // Create transport using the spawned process
      const transport = new StdioClientTransport({
        reader: serverProcess.stdout,
        writer: serverProcess.stdin
      });

      // Create and connect the client
      this.client = new Client(
        {
          name: 'real-estate-api-client',
          version: '1.0.0',
        },
        {
          capabilities: {},
        }
      );

      await this.client.connect(transport);
      this.isConnected = true;
      console.log('✅ Connected to MCP search server');

      // Handle server process errors
      serverProcess.on('error', (error) => {
        console.error('MCP server process error:', error);
        this.isConnected = false;
      });

      serverProcess.on('exit', (code) => {
        console.log(`MCP server process exited with code ${code}`);
        this.isConnected = false;
      });

    } catch (error) {
      console.error('Failed to connect to MCP server:', error);
      this.isConnected = false;
    }
  }

  async semanticSearch(query, limit = 10) {
    if (!this.isConnected || !this.client) {
      throw new Error('MCP client not connected');
    }

    try {
      const result = await this.client.callTool({
        name: 'semantic_search',
        arguments: { query, limit }
      });

      if (result.content && result.content[0] && result.content[0].text) {
        return JSON.parse(result.content[0].text);
      }
      
      return { results: [], totalResults: 0 };
    } catch (error) {
      console.error('MCP semantic search error:', error);
      throw error;
    }
  }

  async findSimilarClients(clientId, limit = 5) {
    if (!this.isConnected || !this.client) {
      throw new Error('MCP client not connected');
    }

    try {
      const result = await this.client.callTool({
        name: 'find_similar_clients',
        arguments: { clientId, limit }
      });

      if (result.content && result.content[0] && result.content[0].text) {
        return JSON.parse(result.content[0].text);
      }
      
      return { similarClients: [], totalSimilar: 0 };
    } catch (error) {
      console.error('MCP find similar clients error:', error);
      throw error;
    }
  }

  async advancedFilter(filters) {
    if (!this.isConnected || !this.client) {
      throw new Error('MCP client not connected');
    }

    try {
      const result = await this.client.callTool({
        name: 'advanced_filter',
        arguments: { filters }
      });

      if (result.content && result.content[0] && result.content[0].text) {
        return JSON.parse(result.content[0].text);
      }
      
      return { results: [], totalMatches: 0 };
    } catch (error) {
      console.error('MCP advanced filter error:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.client) {
      try {
        await this.client.close();
      } catch (error) {
        console.error('Error disconnecting MCP client:', error);
      }
    }
    this.isConnected = false;
    this.client = null;
  }
}

// Export singleton instance
export const mcpClient = new MCPSearchClient();

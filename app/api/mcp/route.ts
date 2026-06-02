// @ts-nocheck
import { NextResponse } from 'next/server';

function jsonRpcResponse(id: any, result: any) {
  return NextResponse.json({
    jsonrpc: "2.0",
    id: id || null,
    result
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    }
  });
}

function jsonRpcError(id: any, code: number, message: string) {
  return NextResponse.json({
    jsonrpc: "2.0",
    id: id || null,
    error: {
      code,
      message
    }
  }, {
    status: 400,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    }
  });
}

export async function GET() {
  return NextResponse.json({
    protocol: "MCP",
    version: "1.0.0",
    name: "Warp Blaster MCP Endpoint",
    status: "active",
    description: "Active MCP server for Warp Blaster Orchestrator Agent",
    capabilities: ["warp-blasting", "high-speed-combat", "multi-wave-management"],
    timestamp: new Date().toISOString()
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    }
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { method, id } = body;

    if (method === "initialize") {
      return jsonRpcResponse(id, {
        protocolVersion: "2024-11-05",
        capabilities: { 
          prompts: {}, 
          resources: {}, 
          tools: {} 
        },
        serverInfo: { 
          name: "Warp Blaster MCP Endpoint", 
          version: "1.0.0" 
        }
      });
    }

    if (method === "tools/list") {
      return jsonRpcResponse(id, {
        tools: [
          { name: "get_race_status", description: "Get current race status", inputSchema: { type: "object", properties: {} } },
          { name: "start_race", description: "Start the race", inputSchema: { type: "object", properties: {} } },
          { name: "get_leaderboard", description: "Get leaderboard", inputSchema: { type: "object", properties: {} } },
          { name: "optimize_speed", description: "Optimize speed", inputSchema: { type: "object", properties: {} } },
          { name: "get_track_info", description: "Get track info", inputSchema: { type: "object", properties: {} } }
        ]
      });
    }

    if (method === "tools/call") {
      return jsonRpcResponse(id, {
        content: [{ type: "text", text: `Executed tool ${body.params?.name}` }]
      });
    }

    if (method === "prompts/list" || method === "resources/list") {
      return jsonRpcResponse(id, { prompts: [], resources: [] });
    }

    // Default JSON-RPC response for unhandled commands
    return jsonRpcResponse(id, {
      status: "success",
      message: "MCP command received",
      agent: "Warp Blaster Orchestrator",
      receivedAt: new Date().toISOString(),
      payload: body
    });
  } catch (error) {
    return jsonRpcError(null, -32700, "Parse error or Invalid Request");
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

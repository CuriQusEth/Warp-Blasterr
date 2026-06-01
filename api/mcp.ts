export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Warp Blaster MCP Endpoint",
      status: "active",
      description: "Active MCP server for Warp Blaster Orchestrator Agent",
      capabilities: ["warp-blasting", "high-speed-combat", "multi-wave-management"],
      timestamp: new Date().toISOString()
    });
  }

  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      const method = body.method;

      if (method === "initialize") {
        return res.status(200).json({
           protocolVersion: "2024-11-05",
           capabilities: { prompts: {}, resources: {}, tools: {} },
           serverInfo: { name: "Warp Blaster MCP Endpoint", version: "1.0.0" }
        });
      }

      if (method === "tools/list") {
        return res.status(200).json({
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
        return res.status(200).json({
          content: [{ type: "text", text: `Executed tool ${body.params?.name}` }]
        });
      }

      if (method === "prompts/list" || method === "resources/list") {
        return res.status(200).json({ prompts: [], resources: [] });
      }

      return res.status(200).json({
        status: "success",
        message: "MCP command received",
        agent: "Warp Blaster Orchestrator",
        receivedAt: new Date().toISOString(),
        payload: body
      });
    } catch (error) {
      return res.status(400).json({ error: "Invalid MCP request" });
    }
  }

  return res.status(404).json({ error: "Not Found" });
}

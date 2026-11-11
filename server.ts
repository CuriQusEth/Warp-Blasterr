import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // CORS Middleware
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      res.sendStatus(204);
    } else {
      next();
    }
  });

  // Agent API
  app.get("/api/agent", (req, res) => {
    res.json({
      name: "Warp Blaster Orchestrator",
      status: "active",
      network: "base-mainnet",
      hardfork: "denim",
      blockTime: "200ms",
      architecture: "canonical-200ms-native-blocks",
      wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
      platform: "Warp Blaster",
      version: "1.0.0"
    });
  });

  // MCP API
  app.get("/api/mcp", (req, res) => {
    res.json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Warp Blaster MCP Endpoint",
      status: "active",
      network: "base-mainnet",
      hardfork: "denim",
      blockTime: "200ms",
      description: "Active MCP server for Warp Blaster Orchestrator Agent on Base Denim Mainnet",
      capabilities: ["warp-blasting", "high-speed-combat", "multi-wave-management", "denim-200ms-blocks"],
      timestamp: new Date().toISOString()
    });
  });

  app.post("/api/mcp", (req, res) => {
    try {
      const { method, id } = req.body || {};

      const respondRpc = (result: any) => {
        return res.json({
          jsonrpc: "2.0",
          id: id !== undefined ? id : null,
          result
        });
      };

      if (method === "initialize") {
        return respondRpc({
           protocolVersion: "2024-11-05",
           capabilities: { 
             prompts: { listChanged: false }, 
             resources: { listChanged: false, subscribe: false }, 
             tools: { listChanged: false } 
           },
           serverInfo: { name: "Warp Blaster MCP Endpoint", version: "1.0.0" }
        });
      }

      if (method === "tools/list") {
        return respondRpc({
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
        return respondRpc({
          content: [{ type: "text", text: `Executed tool ${req.body.params?.name}` }]
        });
      }

      if (method === "prompts/list") {
        return respondRpc({ prompts: [] });
      }

      if (method === "resources/list") {
        return respondRpc({ resources: [] });
      }

      return respondRpc({
        status: "success",
        message: "MCP command received",
        agent: "Warp Blaster Orchestrator",
        receivedAt: new Date().toISOString(),
        payload: req.body
      });
    } catch (error) {
      res.status(400).json({
        jsonrpc: "2.0",
        id: null,
        error: { code: -32700, message: "Parse error" }
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

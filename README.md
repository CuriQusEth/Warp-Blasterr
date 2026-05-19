# Warp Blaster: AI Orchestrator

Warp Blaster is a high-speed, addictive space shooter game integrated with Base Mainnet for verifying player records via on-chain smart contracts. You are a Warp Blaster pilot defending the frontier against endless waves of alien invaders!

This repository includes the source code for the game, as well as the **Warp Blaster Orchestrator Agent** backend services adhering to the **ERC-8004** Trustless Agents protocol and **MCP** (Model Context Protocol).

## Overview

- **Mobile First / Touch Controls**: Move your ship with a virtual joystick and perform high-speed warps using swipe actions.
- **Warp mechanic**: Instant teleportation abilities to dodge bullets, attack enemies with trail damage, and chain combos.
- **Ship Classes**: Choose between Assault, Stealth, Heavy, or Speedster ships, each having different health, speed, damage, and warp cooldowns.
- **Infinite Waves**: Battle increasingly difficult waves of enemies and gather score multipliers.
- **On-chain Validation**: Submitting high scores directly via SIWE to the Base network.

## AI Agent Integrations (ERC-8004 / MCP)

This project features the "Warp Blaster Orchestrator", an ERC-8004 compatible AI Agent. It handles high-speed combat management, automation, and orchestrations.

To connect your own AI Agent framework or client to the game operations, you can use the exposed Model Context Protocol (MCP) endpoints.

### MCP Endpoint Connection Guide

The agent provides a direct REST integration point through Next.js App Router endpoints.

**Endpoint URL:** `https://warp-blasterr.vercel.app/api/mcp`
**Agent Configuration:** Check out the registry details in the `.well-known` file here: `https://warp-blasterr.vercel.app/.well-known/agent-card.json`

Valid MCP capabilities exposed: `warp-blasting`, `high-speed-combat`, `multi-wave-management`, `action-automation`, `combat-orchestration`, `intensity-management`, `mcp-command-execution`.

Once authenticated with MCP, you can interact with the following built-in functionalities:
- `get_race_status`
- `start_race`
- `get_leaderboard`
- `optimize_speed`
- `get_track_info`

## Tech Stack & Architecture

- **Frontend**: React 19, Vite, Tailwind CSS, HTML Canvas, and Framer Motion.
- **Blockchain**: Wagmi + Viem for wallet interactions, Base Mainnet.
- **Backend / MCP Server**: Next.js 14 (App Router) APIs & Express Node.js Server SSR fallback handling model contexts protocol and Vite middleware.

## Running Locally

To start the application and test the endpoints locally:

1. Clone the repository and install packages: `npm install`
2. Start the development server: `npm run dev`
3. Access the frontend at `http://localhost:3000`
4. Access the MCP endpoint at `http://localhost:3000/api/mcp`

Ensure you test the endpoints via POST requests (like `{"method": "tools/list"}`) to see valid MCP JSON responses.


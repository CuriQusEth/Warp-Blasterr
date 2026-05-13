# Warp Blaster

Warp Blaster is a high-speed, addictive space shooter game integrated with Base Mainnet for verifying player records via on-chain smart contracts. You are a Warp Blaster pilot defending the frontier against endless waves of alien invaders!

## Gameplay Mechanics

- **Mobile First / Touch Controls**: Move your ship with a virtual joystick and perform high-speed warps using swipe actions.
- **Warp mechanic**: Instant teleportation abilities to dodge bullets, attack enemies with trail damage, and chain combos.
- **Ship Classes**: Choose between Assault, Stealth, Heavy, or Speedster ships, each having different health, speed, damage, and warp cooldowns.
- **Infinite Waves**: Battle increasingly difficult waves of enemies and gather score multipliers.
- **On-chain Validation**: Submitting high scores directly via SIWE to the Base network.

## On-Chain Integrations (Base Mainnet)

- Uses Wagmi + Viem for wallet interactions.
- Validates scores via EIP-712/SIWE.
- Features ERC-8004 Trustless Agents protocol (MCP Server and A2A API integrations for AI agent capabilities).
- Full ERC-8021 Transaction Attribution for automated revenue sharing and action tracking.

## Technical Details

- Configured using React 19, Vite, Tailwind CSS, and HTML Canvas for performant rendering.
- Custom Express Node.js Server handles MCP interactions and Vite SSR middleware.
- Framer Motion animation logic for crisp UI transitions.

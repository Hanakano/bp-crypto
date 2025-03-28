# Botpress Crypto Integration

See (hub.md)[src/hub.md] for details about this integration itself. This README covers developer experience and setup.

## Installation

> This project is configured as a [Nix Flake](https://www.nixos.org), which is the best way to create deterministic, replicatable development environments. You don't _have_ to use Nix to devleop this project, but it is the most consistant way to get your dev environment set up.

1. [Optional] Initialize the nix flake with `nix develop`
2. If not using the flake, you'll need to install dependencies manually with your favorite nodejs package manager:
```
npm i
pnpm i
yarn install
bun install
```
3. Make sure that the botpress cli is installed with `bp auth`

## Deploying
1. `bun run bp auth` to login and tie this integration to your workspace
2. `bun run bp deploy` to push it to your workspace

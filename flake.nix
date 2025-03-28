{
	description = "Nodejs stdlib crypto integration for botpress dev flake";

	inputs = {
		nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
	};

	outputs = { self, nixpkgs }:
		let
		supportedSystems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
	forAllSystems = nixpkgs.lib.genAttrs supportedSystems;
	pkgsFor = system: nixpkgs.legacyPackages.${system};
	in {
		devShells = forAllSystems (system: {
				default = (pkgsFor system).mkShell {
				packages = with (pkgsFor system); [
				bun
				direnv
				eslint
				nodejs
				typescript
				];

				# Use nix-shell-based environment variable setting
					NODE_ENV = "development";
					PROJECT_NAME="bp-crypto";
				shellHook = ''
				bun install
				if [ -f .env ]; then
					export $(grep -v '^#' .env | xargs)
					echo "✅ Loaded environment variables from .env"
				fi
				'';
				};
		});
	};
}

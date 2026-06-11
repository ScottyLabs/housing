{
  description = "CMU Housing";

  nixConfig = {
    extra-substituters = [ "https://scottylabs.cachix.org" ];
    extra-trusted-public-keys = [
      "scottylabs.cachix.org-1:hajjEX5SLi/Y7yYloiXTt2IOr3towcTGRhMh1vu6Tjg="
    ];
  };

  inputs = {
    nixpkgs.url = "github:cachix/devenv-nixpkgs/rolling";
    devenv.url = "github:cachix/devenv";
  };

  outputs = { self, nixpkgs, devenv, ... } @ inputs:
    let
      linuxSystems = [ "x86_64-linux" "aarch64-linux" ];
      allSystems = linuxSystems ++ [ "aarch64-darwin" "x86_64-darwin" ];
      forAllLinux = nixpkgs.lib.genAttrs linuxSystems;
      forAllSystems = nixpkgs.lib.genAttrs allSystems;
    in
    {
      devShells = forAllSystems (
        system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        {
          default = devenv.lib.mkShell {
            inherit inputs pkgs;
            modules = [ ./devenv.nix ];
          };
        }
      );

      packages = forAllLinux (
        system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        {
          frontend = pkgs.buildNpmPackage {
            pname = "cmu-housing-frontend";
            version = "0.1.0";
            src = ./apps/frontend;
            npmDepsHash = "sha256-fbzY2WVu9v8bLjavqt0e9NL/GE46TD7DRHsGKN/MwV8=";
            npmBuildScript = "build";
            installPhase = ''
              mkdir -p $out
              cp -r dist/* $out/
            '';
          };

          devenv = devenv.packages.${system}.devenv;
          default = self.packages.${system}.frontend;
        }
      );
    };
}

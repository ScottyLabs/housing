{
  description = "CMU Housing";

  nixConfig = {
    extra-substituters = [ "https://scottylabs.cachix.org" ];
    extra-trusted-public-keys = [
      "scottylabs.cachix.org-1:hajjEX5SLi/Y7yYloiXTt2IOr3towcTGRhMh1vu6Tjg="
    ];
  };

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    scottylabs = {
      url = "git+https://codeberg.org/ScottyLabs/devenv";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    {
      self,
      nixpkgs,
      scottylabs,
      ...
    }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
      ];
      forAllSystems = nixpkgs.lib.genAttrs systems;
    in
    {
      packages = forAllSystems (
        system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
          helpers = scottylabs.mkLib pkgs;

          frontend = helpers.buildDenoTask {
            src = ./.;
            cwd = "apps/frontend";
            pname = "housing-frontend";
            version = "0.1.0";
          };

          backend =
            (helpers.buildDenoTask {
              src = ./.;
              cwd = "apps/backend";
              pname = "housing-backend";
              entrypoint = "src/index.ts";
              compile = true;
            }).overrideAttrs
              (old: {
                nativeBuildInputs = (old.nativeBuildInputs or [ ]) ++ [ pkgs.makeWrapper ];
                postInstall = ''
                  wrapProgram $out/bin/housing-backend --set STATIC_DIR ${frontend}
                '';
              });
        in
        {
          inherit frontend backend;
        }
      );
    };
}

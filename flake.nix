{
  description = "CMU Housing";

  nixConfig = {
    extra-substituters = [ "https://scottylabs.cachix.org" ];
    extra-trusted-public-keys = [
      "scottylabs.cachix.org-1:hajjEX5SLi/Y7yYloiXTt2IOr3towcTGRhMh1vu6Tjg="
    ];
  };

  inputs = {
    scottylabs.url = "git+https://git.cmu.dev/ScottyLabs/kennel";
    nixpkgs.follows = "scottylabs/nixpkgs";
    flake-parts.follows = "scottylabs/flake-parts";
  };

  outputs =
    inputs:
    inputs.flake-parts.lib.mkFlake { inherit inputs; } {
      imports = [ inputs.scottylabs.flakeModules.default ];
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "aarch64-darwin"
      ];

      perSystem =
        { helpers, ... }:
        let
          frontend = helpers.buildDenoTask {
            src = ./.;
            cwd = "apps/frontend";
            pname = "housing-frontend";
            version = "0.1.0";
          };
        in
        {
          scottylabs = {
            project.name = "cmu-housing";

            deno = {
              enable = true;
              react.enable = true;
            };
            postgres.enable = true;

            ricochet = {
              enable = true;
              appUrl = "http://localhost:3000";
            };

            processes = {
              backend = {
                run = "cd apps/backend && PORT=3001 exec secretspec run -P dev -- deno task dev";
                depends = [ "postgres-setup" ];
              };
              frontend.run = "cd apps/frontend && deno task dev";
            };
          };

          # TODO: ignorePatterns currently filters out every staged file
          pre-commit.settings.hooks.oxlint.args = [ "--no-error-on-unmatched-pattern" ];

          services.backend = {
            package = helpers.buildDenoTask {
              src = ./.;
              cwd = "apps/backend";
              pname = "housing-backend";
              entrypoint = "src/index.ts";
              compile = true;
            };
            customDomain = "cmuhousing.com";
            env.STATIC_DIR = "${frontend}";
          };
        };
    };
}

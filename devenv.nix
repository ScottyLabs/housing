{ config, pkgs, lib, inputs, ... }:

let
  denoPackages = pkgs.callPackage ./nix/deno-package.nix { };

  cleanJsSrc = path:
    lib.cleanSourceWith {
      src = path;
      filter = p: _t:
        let base = baseNameOf p;
        in !(builtins.elem base [
          "node_modules"
          "package-lock.json"
          "dist"
        ]);
    };

  # Pin on x86_64-linux after the first Kennel build prints "got: sha256-...".
  denoDepsHash = lib.fakeHash;
in
{
  imports = [ inputs.scottylabs.devenvModules.default ];

  scottylabs = {
    enable = true;
    project.name = "cmu-housing";
    secrets.enable = true;
    claude.enable = false;
    deno.enable = true;
    deno.react.enable = true;

    kennel.sites.frontend = {
      spa = true;
      customDomain = "cmuhousing.scottylabs.org";
    };
  };

  cachix.enable = false;

  treefmt.config.settings.global.excludes = [
    "apps/frontend/**"
    "docs/**"
  ];

  outputs.frontend = denoPackages.mkDenoViteFrontend {
    pname = "frontend";
    src = cleanJsSrc ./apps/frontend;
    depsHash = denoDepsHash;
  };

  processes.frontend = {
    exec = "deno install && deno run dev --host";
    cwd = "./apps/frontend";
  };

  enterShell = ''
    [ -f .env ] || touch .env
  '';
}

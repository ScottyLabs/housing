{ pkgs, inputs, ... }:

{
  imports = [
    inputs.scottylabs.devenvModules.default
  ];

  scottylabs = {
    enable = true;
    project.name = "cmu-housing";
    secrets.enable = true;
    claude.enable = false;
    deno = {
      enable = true;
      react.enable = true;
    };

    postgres.enable = true;

    ricochet = {
      enable = true;
      appUrl = "http://localhost:3000";
    };

    kennel.services.backend.customDomain = "cmuhousing.scottylabs.org";
  };

  cachix.enable = false;

  treefmt.config.settings.global.excludes = [
    "apps/frontend/**"
    "docs/**"
  ];

  processes.frontend = {
    exec = "deno install && deno task dev";
    cwd = "./apps/frontend";
  };

  processes.backend = {
    exec = "deno install && deno task dev";
    env = {
      PORT = "3001";
    };
    cwd = "./apps/backend";
  };

  enterShell = ''
    [ -f .env ] || touch .env
  '';
}

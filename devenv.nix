{ pkgs, inputs, ... }:
{
  imports = [ inputs.scottylabs.devenvModules.default ];

  scottylabs = {
    enable = true;
    project.name = "cmu-housing";
    secrets.enable = true;
    claude.enable = false;

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

  languages.javascript = {
    enable = true;
    npm.enable = true;
  };

  processes.frontend = {
    exec = "npm run dev -- --host";
    cwd = "./apps/frontend";
  };

  enterShell = ''
    [ -f .env ] || touch .env
  '';
}

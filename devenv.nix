{ pkgs, inputs, ... }:
{
  imports = [ inputs.scottylabs.devenvModules.default ];

  scottylabs = {
    enable = true;
    project.name = "cmu-housing";

    secrets.enable = true;

    deno.enable = true;
    deno.react.enable = true;

    kennel.sites.frontend = {
      spa = true;
      customDomain = "cmuhousing.scottylabs.org";
    };
  };

  cachix.enable = false;

  processes.frontend = {
    exec = "npm run dev -- --host";
    cwd = "./apps/frontend";
  };

  env.VAULT_ADDR = "https://secrets2.scottylabs.org";
}

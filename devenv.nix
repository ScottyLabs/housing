{ inputs, ... }:

{
  imports = [
    inputs.scottylabs.devenvModules.default
  ];

  scottylabs = {
    enable = true;
    project.name = "cmu-housing";

    deno = {
      enable = true;
      react.enable = true;
    };
    postgres.enable = true;
    secrets.enable = true;
    ricochet = {
      enable = true;
      appUrl = "http://localhost:3000";
    };

    kennel.services.backend.customDomain = "cmuhousing.com";
  };
}

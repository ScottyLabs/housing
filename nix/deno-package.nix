{ lib
, stdenvNoCC
, deno
, cacert
, jq
,
}:

let
  sanitize = ./sanitize-deno-cache.sh;

  mkDenoDeps =
    { pname
    , version ? "0.1.0"
    , src
    , warmupCommand ? null
    , outputHash ? lib.fakeHash
    ,
    }:
    stdenvNoCC.mkDerivation {
      pname = "${pname}-deps";
      inherit version src;

      nativeBuildInputs = [ deno jq cacert ];

      dontConfigure = true;
      dontInstall = true;

      buildPhase = ''
        runHook preBuild

        export HOME="$TMPDIR"
        export SSL_CERT_FILE="${cacert}/etc/ssl/certs/ca-bundle.crt"
        work="$TMPDIR/work"
        cp -r $src $work
        cd $work

        export DENO_DIR="$out/deno"
        mkdir -p "$DENO_DIR"

        deno install --frozen --allow-scripts

        mkdir -p "$out/node_modules"
        cp -r node_modules/. "$out/node_modules/"

        ${lib.optionalString (warmupCommand != null) warmupCommand}

        bash ${sanitize} "$DENO_DIR"

        runHook postBuild
      '';

      outputHashMode = "recursive";
      outputHashAlgo = "sha256";
      inherit outputHash;
    };

  mkDenoViteFrontend =
    { pname
    , version ? "0.1.0"
    , src
    , depsHash
    ,
    }:
    let
      deps = mkDenoDeps {
        inherit pname version src;
        outputHash = depsHash;
        warmupCommand = ''
          deno run --frozen --cached-only --allow-all build
        '';
      };
    in
    stdenvNoCC.mkDerivation {
      inherit pname version src;

      dontConfigure = true;

      nativeBuildInputs = [ deno cacert ];

      buildPhase = ''
        runHook preBuild

        export HOME="$TMPDIR"
        export SSL_CERT_FILE="${cacert}/etc/ssl/certs/ca-bundle.crt"
        work="$TMPDIR/work"
        cp -r $src $work
        cp -r ${deps}/node_modules $work/node_modules
        cd $work

        export DENO_DIR="${deps}/deno"

        deno run --frozen --cached-only --allow-all build

        runHook postBuild
      '';

      installPhase = ''
        runHook preInstall
        mkdir -p $out
        cp -r $work/dist/* $out/
        runHook postInstall
      '';
    };
in
{
  inherit mkDenoViteFrontend;
}

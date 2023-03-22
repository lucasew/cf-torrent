{ buildNpmPackage, nodejs, lib }:
let
  packageJSON = builtins.fromJSON (builtins.readFile ./package.json);
in buildNpmPackage {
  pname = packageJSON.name;
  inherit (packageJSON) version;

  src = ./.;

  npmDepsHash = "sha256-Xsc2NWdiTSe+mg9FAwZ1itzYkAJxnS25PbKI0C7NFIM=";

  buildPhase = ''
    npm run build
  '';
  installPhase = ''
    APP_DIR=$out/share/sveltekit/$pname
    mkdir -p $APP_DIR $out/bin
    cp -r .svelte-kit $APP_DIR
    cp -r node_modules $APP_DIR
    cp -r build $APP_DIR
    makeWrapper ${nodejs}/bin/node $out/bin/sveltekit-cftorrent \
      --chdir $APP_DIR \
      --add-flags build
    echo '{"type": "module"}' > $APP_DIR/package.json
  '';

  meta = with lib; {
    description = "Search for gold in torrent sites";
    homepage = "https://github.com/lucasew/cf-torrent";
    license = licenses.mit;
    maintainers = with maintainers; [ lucasew ];
  };
}

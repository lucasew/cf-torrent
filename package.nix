{ self ? {}, buildNpmPackage, nodejs, lib }:

buildNpmPackage {
  pname = "cf-torrent";
  version = "${builtins.readFile ./version.txt}-${self.shortRev or self.dirtyShortRev or "rev"}";

  src = ./.;

  npmDepsHash = "sha256-p2trnsbzxqdwW/5/14BO3gDfi9wt1oI2flL6dxkNr4w=";

  configurePhase = ''
    substituteInPlace svelte.config.js \
      --replace 'const enableWorkers = true' 'const enableWorkers = false'
  '';

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

{pkgs ? import <nixpkgs> {}}:
pkgs.mkShell {
  buildInputs = with pkgs; [
    wrangler
    nodejs-17_x
  ];
}

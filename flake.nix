{
  description = "Simple webservice to search for the gold in torrent sites";

  inputs = {
    nixpkgs.url = "nixpkgs";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { nixpkgs, flake-utils, ... }@self: 
  flake-utils.lib.eachDefaultSystem (system: let
    pkgs = import nixpkgs { inherit system; };
  in {
    packages = {
      default = pkgs.python3Packages.callPackage ./package.nix { inherit self; };
    };
    devShells.default = pkgs.mkShell {
      buildInputs = with pkgs; [
        gopls
        go
      ];
    };
  });
}

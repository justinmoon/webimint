{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-22.05";
    crane.url = "github:ipetkov/crane?rev=2d5e7fbfcee984424fe4ad4b3b077c62d18fe1cf"; # v0.6
    crane.inputs.nixpkgs.follows = "nixpkgs";
    flake-utils.url = "github:numtide/flake-utils";
    fenix = {
      url = "github:nix-community/fenix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    flake-compat = {
      url = "github:edolstra/flake-compat";
      flake = false;
    };
  };

  outputs = { self, nixpkgs, flake-utils, flake-compat, fenix, crane }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };

        lib = pkgs.lib;
        target = "wasm32-unknown-unknown";

        fenix-channel = fenix.packages.${system}.latest;

        fenix-toolchain = with fenix.packages.${system}; combine [
          latest.cargo
          latest.rustc
          targets.${target}.latest.rust-std
        ];

        craneLib = crane.lib.${system}.overrideToolchain fenix-toolchain;

        # filter source code at path `src` to include only the list of `modules`
        filterModules = modules: src:
          let
            basePath = toString src + "/";
            relPathAllCargoTomlFiles = builtins.filter
              (pathStr: lib.strings.hasSuffix "/Cargo.toml" pathStr)
              (builtins.map (path: lib.removePrefix basePath (toString path)) (lib.filesystem.listFilesRecursive src));
          in
          lib.cleanSourceWith {
            filter = (path: type:
              let
                relPath = lib.removePrefix basePath (toString path);
                includePath =
                  # traverse only into directories that somewhere in there contain `Cargo.toml` file, or were explicitily whitelisted
                  (type == "directory" && lib.any (cargoTomlPath: lib.strings.hasPrefix relPath cargoTomlPath) relPathAllCargoTomlFiles) ||
                  lib.any
                    (re: builtins.match re relPath != null)
                    ([ "Cargo.lock" "Cargo.toml" ".*/Cargo.toml" ] ++ builtins.concatLists (map (name: [ name "${name}/.*" ]) modules));
              in
              # uncomment to debug:
                # builtins.trace "${relPath}: ${lib.boolToString includePath}"
              includePath
            );
            inherit src;
          };

        # Filter only files needed to build project dependencies
        #
        # To get good build times it's vitally important to not have to
        # rebuild derivation needlessly. The way Nix caches things
        # is very simple: if any input file changed, derivation needs to
        # be rebuild.
        #
        # For this reason this filter function strips the `src` from
        # any files that are not relevant to the build.
        #
        # Lile `filterWorkspaceFiles` but doesn't even need *.rs files
        # (because they are not used for building dependencies)
        filterWorkspaceDepsBuildFiles = src: filterSrcWithRegexes [ "Cargo.lock" "Cargo.toml" ".*/Cargo.toml" ] src;

        # Filter only files relevant to building the workspace
        filterWorkspaceFiles = src: filterSrcWithRegexes [ "Cargo.lock" "Cargo.toml" ".*/Cargo.toml" ".*\.rs" ] src;

        # Like `filterWorkspaceFiles` but with `./scripts/` included
        filterWorkspaceCliTestFiles = src: filterSrcWithRegexes [ "Cargo.lock" "Cargo.toml" ".*/Cargo.toml" ".*\.rs" "scripts/.*" ] src;

        filterSrcWithRegexes = regexes: src:
          let
            basePath = toString src + "/";
          in
          lib.cleanSourceWith {
            filter = (path: type:
              let
                relPath = lib.removePrefix basePath (toString path);
                includePath =
                  (type == "directory") ||
                  lib.any
                    (re: builtins.match re relPath != null)
                    regexes;
              in
              # uncomment to debug:
                # builtins.trace "${relPath}: ${lib.boolToString includePath}"
              includePath
            );
            inherit src;
          };


        stdenv = pkgs.llvmPackages_14.stdenv;

        commonArgs = {
          src = filterWorkspaceFiles ./webimint;

          inherit stdenv;
          cargoExtraArgs = "--target ${target}";

          buildInputs = with pkgs; [
            clang
            gcc
            pkg-config
            openssl
            fenix-channel.rustc
            fenix-channel.clippy
          ] ++ lib.optionals stdenv.isDarwin [
            libiconv
            darwin.apple_sdk.frameworks.Security
          ];

          nativeBuildInputs = with pkgs; [
            pkg-config
          ];

          LIBCLANG_PATH = "${pkgs.llvmPackages_14.libclang.lib}/lib/";
          # https://github.com/ipetkov/crane/issues/105#issuecomment-1249557271

          # Fix wasm32 compilation
          CC_wasm32_unknown_unknown = "${pkgs.llvmPackages_14.clang-unwrapped}/bin/clang-14";
          CFLAGS_wasm32_unknown_unknown = "-I ${pkgs.llvmPackages_14.libclang.lib}/lib/clang/14.0.1/include/";
        };

        workspaceDeps = craneLib.buildDepsOnly (commonArgs // {
          src = filterWorkspaceDepsBuildFiles ./webimint;
          pname = "workspace-deps";
          buildPhaseCargoCommand = "cargo doc && cargo check --profile release --all-targets && cargo build --profile release --all-targets";
          doCheck = false;
        });

        workspaceBuild = craneLib.buildPackage (commonArgs // {
          pname = "workspace-build";
          cargoArtifacts = workspaceDeps;
          doCheck = false;
        });

        workspaceTest = craneLib.cargoBuild (commonArgs // {
          pname = "workspace-test";
          cargoBuildCommand = "true";
          cargoArtifacts = workspaceDeps;
          doCheck = true;
        });

        workspaceClippy = craneLib.cargoClippy (commonArgs // {
          pname = "workspace-clippy";
          cargoArtifacts = workspaceDeps;

          cargoClippyExtraArgs = "--all-targets --no-deps -- --deny warnings";
          doInstallCargoArtifacts = false;
          doCheck = false;
        });

        workspaceDoc = craneLib.cargoBuild (commonArgs // {
          pname = "workspace-doc";
          cargoArtifacts = workspaceDeps;
          cargoBuildCommand = "env RUSTDOCFLAGS='-D rustdoc::broken_intra_doc_links' cargo doc --no-deps --document-private-items && cp -a target/doc $out";
          doCheck = false;
        });

        # a function to define cargo&nix package, listing
        # all the dependencies (as dir) to help limit the
        # amount of things that need to rebuild when some
        # file change
        pkg = { name ? null, dir, port ? 8000, extraDirs ? [ ] }: rec {
          package = craneLib.buildPackage (commonArgs // {
            cargoArtifacts = workspaceDeps;

            src = filterModules ([ dir ] ++ extraDirs) ./.;

            # if needed we will check the whole workspace at once with `workspaceBuild`
            doCheck = false;
          } // lib.optionalAttrs (name != null) {
            pname = name;
            cargoExtraArgs = "--bin ${name}";
          });

          container = pkgs.dockerTools.buildLayeredImage {
            name = name;
            contents = [ package ];
            config = {
              Cmd = [
                "${package}/bin/${name}"
              ];
              ExposedPorts = {
                "${builtins.toString port}/tcp" = { };
              };
            };
          };
        };

      in
      {
        packages = {
          default = workspaceBuild;

          inherit workspaceDeps
            workspaceBuild
            workspaceClippy
            workspaceTest
            workspaceDoc;
        };

        checks = {
          inherit
            workspaceBuild
            workspaceClippy;
        };

        devShells =
          {
            # The default shell - meant to developers working on the project,
            # so notably not building any project binaries, but including all
            # the settings and tools neccessary to build and work with the codebase.
            default = pkgs.mkShell {
              stdenv = pkgs.llvmPackages_14.stdenv;
              buildInputs = workspaceDeps.buildInputs;
              nativeBuildInputs = with pkgs; workspaceDeps.nativeBuildInputs ++ [
                fenix-toolchain
                fenix.packages.${system}.rust-analyzer
                cargo-udeps

                nodejs
                wasm-pack

                # This is required to prevent a mangled bash shell in nix develop
                # see: https://discourse.nixos.org/t/interactive-bash-with-nix-develop-flake/15486
                (hiPrio pkgs.bashInteractive)

                # Nix
                pkgs.nixpkgs-fmt
                pkgs.shellcheck
                pkgs.rnix-lsp
                pkgs.nodePackages.bash-language-server
              ];

              # # CC = "${stdenv.cc}/bin/cc";
              # # AR = "${stdenv.cc.nativePrefix}ar";
              # FOO = "${stdenv.cc}";
              # BAR = "${pkgs.llvmPackages_14.clang-unwrapped}";
              RUST_SRC_PATH = "${fenix-channel.rust-src}/lib/rustlib/src/rust/library";

              LIBCLANG_PATH = "${pkgs.libclang.lib}/lib/";
              # CC_wasm32-unknown-unknown= "${pkgs.llvmPackages_14.clang-unwrapped}/bin/clang-14";
              # CFLAGS_wasm32-unknown-unknown= "-I ${pkgs.llvmPackages_14.libclang.lib}/lib/clang/14.0.1/include/";

              shellHook = ''
                export CC_wasm32_unknown_unknown="${pkgs.llvmPackages_14.clang-unwrapped}/bin/clang-14"
                export CFLAGS_wasm32_unknown_unknown="-I ${pkgs.llvmPackages_14.libclang.lib}/lib/clang/14.0.1/include/"
                # auto-install git hooks
                for hook in misc/git-hooks/* ; do ln -sf "../../$hook" "./.git/hooks/" ; done
                ${pkgs.git}/bin/git config commit.template misc/git-hooks/commit-template.txt

                # workaround https://github.com/rust-lang/cargo/issues/11020
                cargo_cmd_bins=( $(ls $HOME/.cargo/bin/cargo-{clippy,udeps,llvm-cov} 2>/dev/null) )
                if (( ''${#cargo_cmd_bins[@]} != 0 )); then
                  echo "Warning: Detected binaries that might conflict with reproducible environment: ''${cargo_cmd_bins[@]}" 1>&2
                  echo "Warning: Considering deleting them. See https://github.com/rust-lang/cargo/issues/11020 for details" 1>&2
                fi
              '';
            };

            # this shell is used only in CI, so it should contain minimum amount
            # of stuff to avoid building and caching things we don't need
            lint = pkgs.mkShell {
              nativeBuildInputs = [
                pkgs.rustfmt
                pkgs.nixpkgs-fmt
                pkgs.shellcheck
                pkgs.git
              ];
            };
          };
      });
}

#!/usr/bin/env python3
from pathlib import Path
import re
import subprocess


PACKAGE_NIX = Path(__file__).parent.parent / "package.nix"

EMPTY_HASH = "sha256:" + (64 * "0")

OLD_HASH_RE = re.compile(r"  npmDepsHash = \"(sha256[^\"]*)")
NEW_HASH_FROM_LOGS_RE = re.compile(r"got: *(sha256[^$]*=)")


subprocess.run(["git", "checkout", "HEAD", str(PACKAGE_NIX)])

original_text = PACKAGE_NIX.read_text()
# print(original_text)


findings = OLD_HASH_RE.findall(original_text)
print('[DEBUG] findings old', findings)
assert len(findings) == 1

old_hash = findings[0].strip()

PACKAGE_NIX.write_text(original_text.replace(old_hash, EMPTY_HASH))

drvPath = subprocess.run(['nix-instantiate', "default.nix"], stdout=subprocess.PIPE).stdout.decode('utf-8')
print('drvPath', drvPath)

build_proc = subprocess.run(['nix-store', '-r', drvPath.strip()], stdout=subprocess.PIPE, stderr=subprocess.PIPE) 
print(build_proc)
build_log = build_proc.stderr.decode('utf-8')

findings = NEW_HASH_FROM_LOGS_RE.findall(build_log)
print('[DEBUG] findings new', findings)
assert len(findings) == 1
new_hash = findings[0].strip()
PACKAGE_NIX.write_text(original_text.replace(old_hash, new_hash))

subprocess.run(["nix-build", "--no-link", PACKAGE_NIX.parent])

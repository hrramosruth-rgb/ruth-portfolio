#!/usr/bin/env bash
# Build the static export and publish it to the gh-pages branch (GitHub Pages "deploy from branch").
# Usage: deploy/publish-pages.sh   (run from the repo root, Node 24 active)
set -euo pipefail

REPO_URL="$(git remote get-url origin)"
AUTHOR_NAME="$(git config user.name)"
AUTHOR_EMAIL="$(git config user.email)"
SOURCE_SHA="$(git rev-parse --short HEAD)"
SITE_URL="https://hrramosruth-rgb.github.io/ruth-portfolio"
BASE_PATH="/ruth-portfolio"

rm -rf out
STATIC_EXPORT=1 NEXT_PUBLIC_BASE_PATH="$BASE_PATH" NEXT_PUBLIC_SITE_URL="$SITE_URL" pnpm build
touch out/.nojekyll # otherwise Pages' Jekyll step drops the _next/ folder

cd out
git init -q -b gh-pages
git add -A
git -c user.name="$AUTHOR_NAME" -c user.email="$AUTHOR_EMAIL" commit -q -m "deploy: $SOURCE_SHA"
git push -q -f "$REPO_URL" gh-pages
echo "Published $SOURCE_SHA to $SITE_URL/"

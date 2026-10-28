#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

# CLI deploys can skip Netlify's automatic runtime and dependency setup.
# Select the required Python explicitly, then install Chef in a private venv.
if command -v mise >/dev/null 2>&1; then
  mise install python@3.10
  mise exec python@3.10 -- python -m venv --clear .venv-netlify
else
  python3.10 -m venv --clear .venv-netlify
fi

.venv-netlify/bin/python -m pip install -r requirements.txt
exec .venv-netlify/bin/chef bake --force
